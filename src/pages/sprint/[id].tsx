import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { FiPlus } from 'react-icons/fi';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

import { db } from '../../services/firebase';

import SEO from '../../components/SEO';
import Modal from '../../components/Modal';
import AddSprint from '../../components/AddSprint';

type Sprint = {
  id: string;
  number: number;
};

type Story = {
  id: string;
  name: string;
};

type SprintProps = {
  sprint: Sprint;
  stories: Story[];
};

const SprintInfo = ({ sprint, stories }: SprintProps) => {
  const [storiesList, setStoriesList] = useState<Story[]>(stories);
  const [isAddSprintOpen, setIsAddSprintOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'sprints', String(sprint.id), 'stories'),
      snapshot => {
        const values: Story[] = [];

        snapshot.forEach(document => {
          values.push({ name: document.data().name, id: document.id });
        });

        setStoriesList(values);
      }
    );

    return () => unsubscribe();
  }, [sprint.id]);

  return (
    <main className="max-w-7xl mx-auto px-4 pb-10">
      <SEO title="User Stories" />

      <h1 className="text-4xl text-white font-bold mb-12">User Stories</h1>

      <ul className="sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid grid-cols-1 gap-10 list-none">
        <li>
          <button
            onClick={() => setIsAddSprintOpen(true)}
            type="button"
            className="flex items-center justify-center w-full h-64 bg-gray-800 rounded-xl border-4 text-white text-2xl font-bold border-green-500 hover:bg-green-500 transition-all duration-200"
          >
            <FiPlus size={64} className="mr-2" />
          </button>
        </li>

        {storiesList.map(story => (
          <li key={story.id}>
            <Link href={`/us/${story.id}`}>
              <a
                href={`/us/${story.id}`}
                className="flex items-center justify-center w-full p-4 h-64 bg-gray-800 rounded-xl border-4 text-white text-2xl font-bold border-purple-500 hover:bg-purple-500 transition-all duration-200"
              >
                US {story.name}
              </a>
            </Link>
          </li>
        ))}
      </ul>

      <Modal isOpen={isAddSprintOpen}>
        <AddSprint onRequestClose={() => setIsAddSprintOpen(false)} />
      </Modal>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = context.params?.id as unknown;

    if (!id) {
      return {
        props: {},
      };
    }

    const sprintRef = doc(db, `sprints/${id}`);

    const sprint = await getDoc(sprintRef);

    const storiesRef = collection(db, 'sprints', String(id), 'stories');

    const stories = await getDocs(storiesRef);

    return {
      props: {
        sprint: {
          ...sprint.data(),
          id: sprint.id,
        },
        stories: stories.docs.map(d => ({ id: d.id, ...d.data() })),
      },
    };
  } catch (err) {
    return {
      props: {
        sprints: [],
      },
    };
  }
};

export default SprintInfo;

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { FiPlus } from 'react-icons/fi';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

import { db } from '../services/firebase';

import SEO from '../components/SEO';
import Modal from '../components/Modal';
import AddSprint from '../components/AddSprint';

type Sprint = {
  id: string;
  number: number;
};

type SprintProps = {
  sprints: Sprint[];
};

const Sprints = ({ sprints }: SprintProps) => {
  const [sprintList, setSprintList] = useState<Sprint[]>(sprints);
  const [isAddSprintOpen, setIsAddSprintOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'sprints'), snapshot => {
      const values: Sprint[] = [];

      snapshot.forEach(document => {
        values.push({ number: document.data().number, id: document.id });
      });

      setSprintList(
        values.sort((sprinta, sprintb) => sprintb.number - sprinta.number)
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 pb-10">
      <SEO title="Sprints" />

      <h1 className="text-4xl text-white font-bold mb-12">Our Sprints</h1>

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

        {sprintList.map(sprint => (
          <li key={sprint.id}>
            <Link href={`/sprint/${sprint.id}`}>
              <a
                href={`/sprint/${sprint.id}`}
                className="flex items-center justify-center w-full p-4 h-64 bg-gray-800 rounded-xl border-4 text-white text-2xl font-bold border-purple-500 hover:bg-purple-500 transition-all duration-200"
              >
                SPRINT {sprint.number}
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

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const sprintsCol = collection(db, 'sprints');

    const sprintsSnapshot = await getDocs(sprintsCol);

    const sprints = sprintsSnapshot.docs.map(document => {
      return { number: document.data().number, id: document.id };
    });

    return {
      props: {
        sprints: sprints.sort(
          (sprinta, sprintb) => sprintb.number - sprinta.number
        ),
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

export default Sprints;

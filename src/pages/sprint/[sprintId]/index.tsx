import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';

import SEO from 'components/SEO';
import Modal from 'components/Modal';
import ItemCard from 'components/ItemCard';
import AddCard from 'components/AddCard';
import GoBackButton from 'components/GoBackButton';
import DefaultPageContainer from 'components/DefaultPageContainer';
import PageTitle from 'components/PageTitle';
import Button from 'components/Button';
import AddStory from 'components/Modals/AddStory';
import EditSprint from 'components/Modals/EditSprint';
import ConfirmDeleteSprint from 'components/Modals/ConfirmDeleteSprint';
import { db } from 'services/firebase';

type Sprint = {
  id: string;
  number: number;
};

type Story = {
  id: string;
  storyId: string;
  title: string;
};

type SprintProps = {
  sprint: Sprint;
  stories: Story[];
};

const SprintInfo = ({ sprint, stories }: SprintProps) => {
  const [storiesList, setStoriesList] = useState<Story[]>(stories);
  const [sprintData, setSprintData] = useState(sprint);
  const [isAddSprintOpen, setIsAddSprintOpen] = useState(false);
  const [isEditSprintOpen, setIsEditSprintOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'sprints', String(sprint.id), 'stories'),
      snapshot => {
        const values: Story[] = [];

        snapshot.forEach(document => {
          values.push({
            title: document.data().title,
            storyId: document.data().storyId,
            id: document.id,
          });
        });

        setStoriesList(values);
      }
    );

    return () => unsubscribe();
  }, [sprint.id]);

  useEffect(() => {
    const docRef = doc(db, 'sprints', sprint.id);

    const unsubscribe = onSnapshot(docRef, document => {
      setSprintData({
        id: document.id,
        number: document.data()?.number,
      });
    });

    return () => unsubscribe();
  }, [sprint.id]);

  return (
    <DefaultPageContainer>
      <SEO title="User Stories" />

      <GoBackButton />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-12">
        <PageTitle>User Stories of Sprint {sprintData.number}</PageTitle>

        <div className="flex gap-4">
          <Button
            bg="bg-blue-500"
            icon={FiEdit3}
            onClick={() => setIsEditSprintOpen(true)}
          >
            Edit Sprint {sprintData.number}
          </Button>

          <Button
            bg="bg-red-500"
            icon={FiTrash2}
            onClick={() => setIsConfirmDeleteOpen(true)}
          >
            Delete Sprint {sprintData.number}
          </Button>
        </div>
      </div>

      <ul className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-10 list-none">
        <li>
          <AddCard onClick={() => setIsAddSprintOpen(true)} />
        </li>

        {storiesList.map(story => (
          <li key={story.id}>
            <ItemCard
              description={story.title}
              href={`/sprint/${sprintData.id}/us/${story.id}`}
              name={`US ${story.storyId}`}
            />
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isAddSprintOpen}
        onRequestClose={() => setIsAddSprintOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <AddStory
          sprintId={sprintData.id}
          onRequestClose={() => setIsAddSprintOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditSprintOpen}
        onRequestClose={() => setIsEditSprintOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <EditSprint
          {...sprintData}
          onRequestClose={() => setIsEditSprintOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isConfirmDeleteOpen}
        onRequestClose={() => setIsConfirmDeleteOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <ConfirmDeleteSprint
          {...sprintData}
          onRequestClose={() => setIsConfirmDeleteOpen(false)}
        />
      </Modal>
    </DefaultPageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = context.params?.sprintId as unknown;

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
        stories: [],
      },
    };
  }
};

export default SprintInfo;

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

import { db } from 'services/firebase';

import SEO from 'components/SEO';
import Modal from 'components/Modal';
import ItemCard from 'components/ItemCard';
import AddCard from 'components/AddCard';
import GoBackButton from 'components/GoBackButton';
import DefaultPageContainer from 'components/DefaultPageContainer';
import PageTitle from 'components/PageTitle';
import Button from 'components/Button';
import ConfirmDeleteStory from 'components/Modals/ConfirmDeleteStory';
import EditStory from 'components/Modals/EditStory';
import AddTask from 'components/Modals/AddTask';

type Task = {
  id: string;
  name: string;
  content: string;
};

type Story = {
  id: string;
  storyId: string;
  title: string;
  url: string;
};

type TasksProps = {
  story: Story;
  tasks: Task[];
  sprintId: string;
};

const Tasks = ({ story, sprintId, tasks }: TasksProps) => {
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [storyData, setStoryData] = useState(story);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditStoryOpen, setIsEditStoryOpen] = useState(false);
  const [isConfirmDeleteStory, setIsConfirmDeleteStory] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(
        db,
        'sprints',
        String(sprintId),
        'stories',
        String(story.id),
        'tasks'
      ),
      snapshot => {
        const values: Task[] = [];

        snapshot.forEach(document => {
          values.push({
            name: document.data().name,
            content: document.data().content,
            id: document.id,
          });
        });

        setTaskList(values);
      }
    );

    return () => unsubscribe();
  }, [sprintId, story.id]);

  useEffect(() => {
    const docRef = doc(db, 'sprints', sprintId, 'stories', story.id);

    const unsubscribe = onSnapshot(docRef, document => {
      setStoryData({
        id: document.id,
        storyId: document.data()?.storyId,
        title: document.data()?.title,
        url: document.data()?.url,
      });
    });

    return () => unsubscribe();
  }, [sprintId, story.id]);

  return (
    <DefaultPageContainer>
      <SEO title="User Stories" />

      <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-12">
        <GoBackButton />

        <div className="flex gap-4">
          <Button
            bg="bg-blue-500"
            icon={FiEdit3}
            onClick={() => setIsEditStoryOpen(true)}
          >
            Edit Story {storyData.storyId}
          </Button>

          <Button
            bg="bg-red-500"
            icon={FiTrash2}
            onClick={() => setIsConfirmDeleteStory(true)}
          >
            Delete Story {storyData.storyId}
          </Button>
        </div>
      </div>

      <PageTitle>
        <a
          href={storyData.url}
          target="_blank"
          className="underline"
          rel="noopener noreferrer"
        >
          {storyData.storyId} - {storyData.title}
        </a>
      </PageTitle>

      <p className="mt-12 mb-4 text-3xl text-white font-semibold">Tasks</p>

      <ul className="sm:grid-cols-2 md:grid-cols-3 grid grid-cols-1 gap-10 list-none">
        <li>
          <AddCard onClick={() => setIsAddTaskOpen(true)} />
        </li>

        {taskList.map(task => (
          <li key={task.id}>
            <ItemCard
              href={`/sprint/${sprintId}/us/${story.id}/task/${task.id}`}
              name={task.name}
            />
          </li>
        ))}
      </ul>

      <div id="editorjs" />

      <Modal
        isOpen={isConfirmDeleteStory}
        onRequestClose={() => setIsConfirmDeleteStory(false)}
        shouldCloseOnOverlayClick={false}
      >
        <ConfirmDeleteStory
          docId={storyData.id}
          storyId={storyData.storyId}
          sprintId={sprintId}
          onRequestClose={() => setIsConfirmDeleteStory(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditStoryOpen}
        onRequestClose={() => setIsEditStoryOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <EditStory
          {...storyData}
          sprintId={sprintId}
          onRequestClose={() => setIsEditStoryOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAddTaskOpen}
        onRequestClose={() => setIsAddTaskOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <AddTask
          usId={storyData.id}
          sprintId={sprintId}
          onRequestClose={() => setIsAddTaskOpen(false)}
        />
      </Modal>
    </DefaultPageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const usId = context.params?.usId as unknown;
    const sprintId = context.params?.sprintId as unknown;

    if (!usId || !sprintId) {
      return {
        props: {},
      };
    }

    const storyRef = doc(db, `sprints/${sprintId}/stories/${usId}`);

    const story = await getDoc(storyRef);

    const tasksRef = collection(
      db,
      'sprints',
      String(sprintId),
      'stories',
      String(usId),
      'tasks'
    );

    const tasks = await getDocs(tasksRef);

    return {
      props: {
        story: {
          ...story.data(),
          id: story.id,
        },
        sprintId,
        tasks: tasks.docs.map(d => ({ id: d.id, ...d.data() })),
      },
    };
  } catch (err) {
    return {
      props: {
        tasks: [],
      },
    };
  }
};

export default Tasks;

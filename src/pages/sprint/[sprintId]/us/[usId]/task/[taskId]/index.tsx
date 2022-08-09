import { useCallback, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { FiEdit3, FiLoader, FiSave, FiTrash2 } from 'react-icons/fi';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';

import { db } from 'services/firebase';

import SEO from 'components/SEO';
import Modal from 'components/Modal';
import GoBackButton from 'components/GoBackButton';
import DefaultPageContainer from 'components/DefaultPageContainer';
import PageTitle from 'components/PageTitle';
import Button from 'components/Button';
import RichText from 'components/RichText';
import ConfirmDeleteTask from 'components/Modals/ConfirmDeleteTask';
import EditTask from 'components/Modals/EditTask';
import toast from 'react-hot-toast';

type TTask = {
  id: string;
  name: string;
  content: string;
};

type TaskProps = {
  task: TTask;
  usId: string;
  sprintId: string;
};

const AUTOSAVE_INTERVAL = 3000;

const Task = ({ usId, sprintId, task }: TaskProps) => {
  const endpointTypes = [
    {
      label: 'GET',
      value:
        '<blockquote><strong>Type: </strong>GET</blockquote><p><br></p><blockquote><strong>Defined route: </strong>/api</blockquote><p><br></p><blockquote><strong>Notes:</strong> Enter here notes about the endpoint</blockquote><p><br></p><blockquote><strong>Params:</strong></blockquote><p><br></p><blockquote><strong>Response:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>New fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>Remove fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre>',
    },
    {
      label: 'POST',
      value:
        '<blockquote><strong>Type: </strong>POST</blockquote><p><br></p><blockquote><strong>Defined route: </strong>/api</blockquote><p><br></p><blockquote><strong>Notes:</strong> Enter here notes about the endpoint</blockquote><p><br></p><blockquote><strong>Params:</strong></blockquote><p><br></p><blockquote><strong>Body:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>New fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>Remove fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre>',
    },
    {
      label: 'PUT',
      value:
        '<blockquote><strong>Type: </strong>PUT</blockquote><p><br></p><blockquote><strong>Defined route: </strong>/api</blockquote><p><br></p><blockquote><strong>Notes:</strong> Enter here notes about the endpoint</blockquote><p><br></p><blockquote><strong>Params:</strong></blockquote><p><br></p><blockquote><strong>Body:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>New fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>Remove fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre>',
    },
    {
      label: 'DELETE',
      value:
        '<blockquote><strong>Type: </strong>DELETE</blockquote><p><br></p><blockquote><strong>Defined route: </strong>/api</blockquote><p><br></p><blockquote><strong>Notes:</strong> Enter here notes about the endpoint</blockquote><p><br></p><blockquote><strong>Params:</strong></blockquote><p><br></p><blockquote>',
    },
    {
      label: 'PATCH',
      value:
        '<blockquote><strong>Type: </strong>PATCH</blockquote><p><br></p><blockquote><strong>Defined route: </strong>/api</blockquote><p><br></p><blockquote><strong>Notes:</strong> Enter here notes about the endpoint</blockquote><p><br></p><blockquote><strong>Params:</strong></blockquote><p><br></p><blockquote>',
    },
  ];

  const [taskData, setTaskData] = useState(task);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [isConfirmDeleteTask, setIsConfirmDeleteTask] = useState(false);
  const [lastContent, setLastContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const docRef = doc(
      db,
      'sprints',
      sprintId,
      'stories',
      usId,
      'tasks',
      task.id
    );

    const unsubscribe = onSnapshot(docRef, document => {
      setTaskData({
        id: document.id,
        name: document.data()?.name,
        content: document.data()?.content,
      });
    });

    return () => unsubscribe();
  }, [sprintId, task.id, usId]);

  const handleSave = useCallback(
    async (updatedContent: string) => {
      try {
        const docRef = doc(
          db,
          'sprints',
          sprintId,
          'stories',
          usId,
          'tasks',
          taskData.id
        );

        await updateDoc(docRef, {
          ...taskData,
          content: updatedContent,
        });
      } catch (err) {
        toast.error('Error saving the content');
      }
    },
    [sprintId, taskData, usId]
  );

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (lastContent !== taskData.content) {
        await handleSave(taskData.content);

        setLastContent(taskData.content);
      }

      setIsSaving(false);
    }, AUTOSAVE_INTERVAL);

    return () => clearTimeout(timer);
  }, [handleSave, lastContent, taskData.content]);

  function handleChangeEndpointType(value: string) {
    const findContent = endpointTypes.find(type => type.label === value);

    setTaskData(current => ({ ...current, content: findContent?.value || '' }));
  }

  return (
    <DefaultPageContainer>
      <SEO title={task.name} />

      <div className="pb-20">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-12">
          <GoBackButton />

          <div className="flex gap-4">
            <Button
              bg="bg-blue-500"
              icon={FiEdit3}
              onClick={() => setIsEditTaskOpen(true)}
            >
              Edit Task
            </Button>

            <Button
              bg="bg-red-500"
              icon={FiTrash2}
              onClick={() => setIsConfirmDeleteTask(true)}
            >
              Delete Task
            </Button>
          </div>
        </div>

        <div className="mb-10">
          <PageTitle>{taskData.name}</PageTitle>
        </div>

        <div className="mb-4 flex justify-between items-end">
          <div>
            <span className="text-white font-bold block mb-2">
              Choose endpoint type:
            </span>

            <div className="flex items-center gap-4">
              <Button
                bg="bg-blue-500"
                onClick={() => handleChangeEndpointType('GET')}
              >
                GET
              </Button>

              <Button
                bg="bg-green-600"
                onClick={() => handleChangeEndpointType('POST')}
              >
                POST
              </Button>

              <Button
                bg="bg-orange-500"
                onClick={() => handleChangeEndpointType('PUT')}
              >
                PUT
              </Button>

              <Button
                bg="bg-red-600"
                onClick={() => handleChangeEndpointType('DELETE')}
              >
                DELETE
              </Button>

              <Button
                bg="bg-yellow-500"
                onClick={() => handleChangeEndpointType('PATCH')}
              >
                PATCH
              </Button>
            </div>
          </div>

          {isSaving && (
            <span className="text-white font-semibold flex items-center gap-2">
              <FiLoader />
              Saving...
            </span>
          )}

          {!isSaving && (
            <span className="text-white font-semibold flex items-center gap-2">
              <FiSave />
              Saved
            </span>
          )}
        </div>

        <RichText
          value={taskData.content}
          onChange={value => {
            setIsSaving(true);
            setTaskData(oldState => ({ ...oldState, content: value }));
          }}
        />
      </div>

      <Modal
        isOpen={isConfirmDeleteTask}
        onRequestClose={() => setIsConfirmDeleteTask(false)}
        shouldCloseOnOverlayClick={false}
      >
        <ConfirmDeleteTask
          docId={taskData.id}
          name={taskData.name}
          sprintId={sprintId}
          usId={usId}
          onRequestClose={() => setIsConfirmDeleteTask(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditTaskOpen}
        onRequestClose={() => setIsEditTaskOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <EditTask
          {...taskData}
          usId={usId}
          sprintId={sprintId}
          onRequestClose={() => setIsEditTaskOpen(false)}
        />
      </Modal>
    </DefaultPageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const usId = context.params?.usId as unknown;
    const sprintId = context.params?.sprintId as unknown;
    const taskId = context.params?.taskId as unknown;

    if (!usId || !sprintId || !taskId) {
      return {
        props: {},
      };
    }

    const taskRef = doc(
      db,
      `sprints/${sprintId}/stories/${usId}/tasks/${taskId}`
    );

    const task = await getDoc(taskRef);

    return {
      props: {
        task: {
          ...task.data(),
          id: task.id,
        },
        usId,
        sprintId,
      },
    };
  } catch (err) {
    return {
      props: {},
    };
  }
};

export default Task;

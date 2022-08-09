import { deleteDoc, doc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { db } from 'services/firebase';

import Button from 'components/Button';

type ConfirmDeleteTaskProps = {
  onRequestClose: () => void;
  name: string;
  sprintId: string;
  docId: string;
  usId: string;
};

const ConfirmDeleteTask = ({
  onRequestClose,
  name,
  sprintId,
  usId,
  docId,
}: ConfirmDeleteTaskProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleDeleteSprint() {
    try {
      setIsLoading(true);

      const docRef = doc(
        db,
        'sprints',
        sprintId,
        'stories',
        usId,
        'tasks',
        docId
      );

      await deleteDoc(docRef);

      toast.success('Task deleted successfully');

      router.push(`/sprint/${sprintId}/us/${usId}`);
    } catch (err) {
      toast.error('Error deleting the task, please try again');

      setIsLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl text-white font-bold mb-6">
        Delete Task: {name}
      </h1>

      <p className="text-white">
        Are you sure you want to remove the{' '}
        <strong className="text-red-500">&quot;Task: {name}&quot;</strong>?
      </p>

      <div className="mt-6 flex gap-2 items-center justify-end">
        <Button disabled={isLoading} onClick={handleDeleteSprint}>
          Confirm
        </Button>

        <Button bg="bg-red-500" onClick={onRequestClose} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default ConfirmDeleteTask;

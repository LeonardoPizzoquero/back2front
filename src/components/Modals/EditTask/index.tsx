import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';

import { db } from 'services/firebase';

import Button from 'components/Button';

type FormData = {
  name: string;
};

type EditTaskProps = {
  onRequestClose: () => void;
  sprintId: string;
  id: string;
  usId: string;
  name: string;
  content: string;
};

const EditTask = ({
  onRequestClose,
  id,
  sprintId,
  usId,
  name,
}: EditTaskProps) => {
  const formSchema = yup.object().shape({
    name: yup.string().required('Name is a required field'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async values => {
    try {
      const docRef = doc(db, 'sprints', sprintId, 'stories', usId, 'tasks', id);

      await updateDoc(docRef, {
        ...values,
      });

      toast.success('Task updated successfully');

      onRequestClose();
    } catch (err) {
      toast.error('Error updating the task, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl text-white font-bold mb-6">
        Update Task: {name}
      </h1>

      <label htmlFor="name" className="text-white">
        Name:
        <input
          id="name"
          type="text"
          placeholder="Enter the task name"
          className="w-full block px-4 py-2 rounded-lg text-gray-800 mt-2"
          {...register('name')}
        />
      </label>

      {errors.name && (
        <p className="text-red-500 mt-1">{errors.name.message}</p>
      )}

      <div className="mt-6 flex gap-2 items-center justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Save
        </Button>

        <Button
          bg="bg-red-500"
          onClick={onRequestClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditTask;

import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/router';

import { db } from 'services/firebase';

import Button from 'components/Button';

type FormData = {
  name: string;
};

type AddTaskProps = {
  onRequestClose: () => void;
  sprintId: string;
  usId: string;
};

const AddTask = ({ onRequestClose, sprintId, usId }: AddTaskProps) => {
  const router = useRouter();

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
      name: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async values => {
    try {
      const response = await addDoc(
        collection(db, 'sprints', sprintId, 'stories', usId, 'tasks'),
        {
          name: values.name,
          content:
            '<blockquote><strong>Type: </strong>GET</blockquote><p><br></p><blockquote><strong>Defined route: </strong>/api</blockquote><p><br></p><blockquote><strong>Notes:</strong> Enter here notes about the endpoint</blockquote><p><br></p><blockquote><strong>Params:</strong></blockquote><p><br></p><blockquote><strong>Response:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>New fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre><p><br></p><blockquote><strong>Remove fields:</strong></blockquote><pre class="ql-syntax" spellcheck="false">data: [{ name: string, }]</pre>',
        }
      );

      toast.success('Task created successfully');

      router.push(`/sprint/${sprintId}/us/${usId}/task/${response.id}`);
    } catch (err) {
      toast.error('Error updating the task, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl text-white font-bold mb-6">Create Task</h1>

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

export default AddTask;

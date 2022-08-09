import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';

import { db } from 'services/firebase';
import Button from 'components/Button';

type FormData = {
  storyId: string;
  title: string;
  url: string;
};

type AddStoryProps = {
  onRequestClose: () => void;
  sprintId: string;
};

const AddStory = ({ sprintId, onRequestClose }: AddStoryProps) => {
  const router = useRouter();

  const formSchema = yup.object().shape({
    title: yup.string().required('Title is a required field'),
    storyId: yup.string().required('Story ID is a required field'),
    url: yup.string().required('Story URL is a required field'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      storyId: '',
      title: '',
      url: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async values => {
    try {
      const response = await addDoc(
        collection(db, 'sprints', sprintId, 'stories'),
        {
          title: values.title,
          storyId: values.storyId,
          url: values.url,
        }
      );

      toast.success('Story created successfully');

      router.push(`/sprint/${sprintId}/us/${response.id}`);
    } catch (err) {
      toast.error('Error creating the story, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl text-white font-bold mb-6">Create new story</h1>

      <label htmlFor="storyId" className="text-white">
        Story ID:
        <input
          id="storyId"
          type="text"
          placeholder="#9999"
          className="w-20 block px-4 py-2 rounded-lg text-gray-800 mt-2"
          {...register('storyId')}
        />
      </label>

      {errors.storyId && (
        <p className="text-red-500 mt-1">{errors.storyId.message}</p>
      )}

      <label htmlFor="title" className="text-white mt-4 block">
        Title:
        <input
          id="title"
          type="text"
          placeholder="Type the title..."
          className="w-full block px-4 py-2 rounded-lg text-gray-800 mt-2"
          {...register('title')}
        />
      </label>

      {errors.title && (
        <p className="text-red-500 mt-1">{errors.title.message}</p>
      )}

      <label htmlFor="url" className="text-white mt-4 block">
        URL:
        <input
          id="url"
          type="text"
          placeholder="Type the URL..."
          className="w-full block px-4 py-2 rounded-lg text-gray-800 mt-2"
          {...register('url')}
        />
      </label>

      {errors.url && <p className="text-red-500 mt-1">{errors.url.message}</p>}

      <div className="mt-6 flex gap-2 items-center justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Create
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

export default AddStory;

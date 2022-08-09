import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { addDoc, collection } from 'firebase/firestore';

import { db } from 'services/firebase';
import Button from 'components/Button';

type FormData = {
  number: string;
};

type AddSprintProps = {
  onRequestClose: () => void;
};

const AddSprint = ({ onRequestClose }: AddSprintProps) => {
  const router = useRouter();

  const formSchema = yup.object().shape({
    number: yup.string().required('Number is a required field'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      number: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async values => {
    try {
      const response = await addDoc(collection(db, 'sprints'), {
        number: Number(values.number),
      });

      toast.success('Sprint created successfully');

      router.push(`/sprint/${response.id}`);
    } catch (err) {
      toast.error('Error creating the sprint, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl text-white font-bold mb-6">Create new sprint</h1>

      <label htmlFor="number" className="text-white">
        Sprint Number:
        <input
          id="number"
          type="number"
          placeholder="Type number..."
          className="w-full block px-4 py-2 rounded-lg text-gray-800 mt-2"
          {...register('number')}
        />
      </label>

      {errors.number && (
        <p className="text-red-500 mt-1">{errors.number.message}</p>
      )}

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

export default AddSprint;

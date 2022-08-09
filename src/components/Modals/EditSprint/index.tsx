import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { doc, updateDoc } from 'firebase/firestore';

import { db } from 'services/firebase';

import Button from 'components/Button';

type FormData = {
  number: string;
};

type EditSprintProps = {
  onRequestClose: () => void;
  number: number;
  id: string;
};

const EditSprint = ({ onRequestClose, id, number }: EditSprintProps) => {
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
      number: String(number),
    },
  });

  const onSubmit: SubmitHandler<FormData> = async values => {
    try {
      const docRef = doc(db, 'sprints', id);

      await updateDoc(docRef, {
        number: Number(values.number),
      });

      toast.success('Sprint updated successfully');

      onRequestClose();
    } catch (err) {
      toast.error('Error updating the sprint, please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-3xl text-white font-bold mb-6">
        Update Sprint {number}
      </h1>

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

export default EditSprint;

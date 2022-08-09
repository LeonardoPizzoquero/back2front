import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

import { db } from 'services/firebase';

import SEO from 'components/SEO';
import Modal from 'components/Modal';
import AddSprint from 'components/Modals/AddSprint';
import ItemCard from 'components/ItemCard';
import AddCard from 'components/AddCard';
import PageTitle from 'components/PageTitle';
import DefaultPageContainer from 'components/DefaultPageContainer';

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
    <DefaultPageContainer>
      <SEO title="Sprints" />

      <PageTitle>Our Sprints</PageTitle>

      <ul className="mt-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid grid-cols-1 gap-10 list-none">
        <li>
          <AddCard onClick={() => setIsAddSprintOpen(true)} />
        </li>

        {sprintList.map(sprint => (
          <li key={sprint.id}>
            <ItemCard
              href={`/sprint/${sprint.id}`}
              name={`SPRINT ${sprint.number}`}
            />
          </li>
        ))}
      </ul>

      <Modal
        isOpen={isAddSprintOpen}
        onRequestClose={() => setIsAddSprintOpen(false)}
        shouldCloseOnOverlayClick={false}
      >
        <AddSprint onRequestClose={() => setIsAddSprintOpen(false)} />
      </Modal>
    </DefaultPageContainer>
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

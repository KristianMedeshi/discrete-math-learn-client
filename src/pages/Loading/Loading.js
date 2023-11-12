import { PulseLoader } from 'react-spinners';
import PageWrapper from '../../components/PageWrapper';

function Loading() {
  return (
    <PageWrapper>
      <div className="flex justify-center items-center w-full h-[60vh]">
        <PulseLoader
          color="var(--color-light-purple)"
          speedMultiplier={0.4}
        />
      </div>
    </PageWrapper>
  );
}

export default Loading;

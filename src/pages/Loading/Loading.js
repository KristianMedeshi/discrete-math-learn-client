import PageWrapper from '../../components/PageWrapper';
import Loader from '../../components/Loader/Loader';

function Loading({ className }) {
  return (
    <PageWrapper className={className}>
      <div className="flex justify-center items-center w-full h-[60vh]">
        <Loader />
      </div>
    </PageWrapper>
  );
}

export default Loading;

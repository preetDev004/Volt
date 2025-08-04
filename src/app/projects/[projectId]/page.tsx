const page = async ({ params }: { params: { projectId: string } }) => {
  return <div>Project {params.projectId}</div>;
};

export default page;

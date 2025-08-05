const page = async ({ params }: { params: Promise<{ projectId: string }> }) => {
  const { projectId } = await params;
  return <div>Project {projectId}</div>;
};

export default page;

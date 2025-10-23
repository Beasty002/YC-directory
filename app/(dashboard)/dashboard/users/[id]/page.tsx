const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  return (
    <>
      <h1>User Detail Page of user with ID: {id}</h1>
      <p>This is the detail page for a specific user.</p>
    </>
  );
};

export default page;

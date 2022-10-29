const paginacija = (dataArr, perPage) => {
  const chunks = [];
  const copy = [].concat(...dataArr);
  while (copy.length) {
    chunks.push(copy.splice(0, perPage));
  }

  return chunks;
};

const billsRoute = "http://localhost:3000/api/bills";
const userRoute = "http://localhost:3000/api/users";

export { paginacija, userRoute, billsRoute };

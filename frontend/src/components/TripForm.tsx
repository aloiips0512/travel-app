import React from "react";

const TripForm: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const newTrip = { title, description, startDate, endDate };
        fetch("http://localhost:5050/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            body: JSON.stringify(newTrip),
          },
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        });
        console.log({ title, description, startDate, endDate });
      }}
    >
      <h1>Add a trip</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button>Submit</button>
    </form>
  );
};
export default TripForm;

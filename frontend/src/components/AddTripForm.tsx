import { Button, Heading, Input, VStack } from "@chakra-ui/react";
import React from "react";

type AddTripFormProps = {
  userId: string;
  onSuccess?: () => void;
};

export default function AddTripForm({ userId, onSuccess }: AddTripFormProps) {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const newTrip = { title, description, startDate, endDate, userId };
        fetch("http://localhost:5050/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTrip),
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Network response was not ok");
            }
            return res.json();
          })
          .then((data) => {
            console.log("Trip added:", data);
            setDescription("");
            setTitle("");
            setStartDate("");
            setEndDate("");
            if (onSuccess) {
              onSuccess();
            }
          });
        console.log({ title, description, startDate, endDate });
      }}
    >
      <VStack align="stretch">
        <Heading size="md">Add a trip</Heading>
        <Input
          type="text"
          placeholder="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Trip Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button colorScheme="teal" type="submit">
          Submit
        </Button>
      </VStack>
    </form>
  );
}

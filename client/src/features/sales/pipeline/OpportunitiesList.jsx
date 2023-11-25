import { Flex, Input, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import * as api from "services";

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await api.getOpportunities();
        setOpportunities(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOpportunities();
  }, []);

  const [filter, setFilter] = useState({
    name: "",
    clientName: "",
    stage: "",
  });

  const handleFilterChange = (field, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [field]: value,
    }));
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    return (
      opp.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      opp.clientName.toLowerCase().includes(filter.clientName.toLowerCase()) &&
      opp.stage.toLowerCase().includes(filter.stage.toLowerCase())
    );
  });

  return (
    <Flex direction="column" p={4}>
      <Flex mb={4}>
        <Input
          placeholder="Filter by Opportunity Name"
          value={filter.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          mr={2}
        />
        <Input
          placeholder="Filter by Client Name"
          value={filter.clientName}
          onChange={(e) => handleFilterChange("clientName", e.target.value)}
          mr={2}
        />
        <Input
          placeholder="Filter by Stage"
          value={filter.stage}
          onChange={(e) => handleFilterChange("stage", e.target.value)}
        />
      </Flex>

      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Opportunity Name</Th>
            <Th>Client Name</Th>
            <Th>Stage</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredOpportunities.map((opp) => (
            <Tr key={opp.id}>
              <Td>{opp.name}</Td>
              <Td>{opp.clientName}</Td>
              <Td>{opp.stage}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};

export default OpportunitiesList;

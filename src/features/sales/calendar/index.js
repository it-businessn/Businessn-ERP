import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from "@chakra-ui/react";
import { DashboardLayout } from "layouts";
import moment from "moment";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const localizer = momentLocalizer(moment);

const CalendarDashboard = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    time: "12:00 AM",
    selectedDate: null,
  });

  const handleAddTask = () => {
    if (!newTask.selectedDate) {
      // Handle the case where no date is selected
      return;
    }

    const newEvent = {
      title: newTask.title,
      start: moment(newTask.selectedDate).toDate(),
      end: moment(newTask.selectedDate).add(1, "hour").toDate(),
    };

    setEvents([...events, newEvent]);
    setNewTask({ title: "", time: "12:00 AM", selectedDate: null });
    setShowModal(false);
  };

  const handleTaskTitleChange = (e) => {
    setNewTask({ ...newTask, title: e.target.value });
  };

  const handleTimeChange = (e) => {
    setNewTask({ ...newTask, time: e.target.value });
  };

  const handleDateSelect = ({ start }) => {
    setNewTask({ ...newTask, selectedDate: start });
    setShowModal(true);
  };
  const eventStyleGetter = () => ({
    style: {
      backgroundColor: "#6074c5",
      color: "white",
      border: "none",
    },
  });
  const ScrollToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    return (
      <Flex justifyContent="space-between">
        <HStack>
          <button onClick={goToBack}>
            <MdChevronLeft />
          </button>
          <button onClick={goToNext}>
            <MdChevronRight />
          </button>
        </HStack>
        <Center>
          <button>{toolbar.label}</button>
        </Center>
        <HStack>
          <ButtonGroup spacing="0">
            <Button variant="ghost" onClick={() => toolbar.onView("day")}>
              Day
            </Button>
            <Button variant="ghost" onClick={() => toolbar.onView("week")}>
              Week
            </Button>
            <Button variant="ghost" onClick={() => toolbar.onView("month")}>
              Month
            </Button>
            <Button variant="ghost" onClick={() => toolbar.onView("agenda")}>
              Agenda
            </Button>
          </ButtonGroup>
        </HStack>
        {/* <button onClick={toolbar.onNavigateToday}>Today</button> */}
      </Flex>
    );
  };
  return (
    <DashboardLayout>
      <Box width="100%">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleDateSelect}
          eventPropGetter={eventStyleGetter}
          formats={{
            eventTimeRangeFormat: () => null, // remove default time display
          }}
          components={{
            event: (event) => (
              <div>
                <div>{moment(event.start).format("LT")}</div>
                <Text fontSize="sm">{event.title}</Text>
              </div>
            ),
            toolbar: ScrollToolbar, // Use the custom toolbar
          }}
          dayFormat={(date, culture, localizer) => moment(date).format("D dd")} // Customize day format
          dayHeaderFormat={(date, culture, localizer) =>
            moment(date).format("D dddd")
          } // Customize day header format
          views={["day", "week", "month", "agenda"]} // Change the order of views
        />
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalOverlay />
          <ModalContent zIndex="2">
            <ModalHeader>Add Task</ModalHeader>
            <ModalBody>
              <FormControl>
                <FormLabel>Task Title</FormLabel>
                <Input
                  type="text"
                  value={newTask.title}
                  onChange={handleTaskTitleChange}
                />
              </FormControl>
              <FormControl mt={4}>
                <FormLabel>Time</FormLabel>
                <Select
                  placeholder="Select time"
                  value={newTask.time}
                  onChange={handleTimeChange}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option
                      key={hour}
                      value={`${hour}:00 AM`}
                    >{`${hour}:00 AM`}</option>
                  ))}
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option
                      key={hour + 12}
                      value={`${hour}:00 PM`}
                    >{`${hour}:00 PM`}</option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" mr={3} onClick={handleAddTask}>
                Add Task
              </Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </DashboardLayout>
  );
};

export default CalendarDashboard;

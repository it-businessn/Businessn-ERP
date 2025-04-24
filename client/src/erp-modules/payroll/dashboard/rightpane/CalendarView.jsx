import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  Badge,
  useStyleConfig,
} from "@chakra-ui/react";
import { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { ChevronLeftIcon, ChevronRightIcon, AddIcon, SearchIcon } from "@chakra-ui/icons";
import { getDefaultDateTime } from "utils/convertDate";
import { css } from "@emotion/react";

// Custom CSS for the calendar
const calendarStyles = css`
  .rbc-calendar {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  }

  .rbc-header {
    padding: 8px 0;
    font-weight: 500;
    font-size: 0.9rem;
    color: #4a5568;
    background-color: #f7fafc;
    border-bottom: 1px solid #e2e8f0;
  }

  .rbc-month-view {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }

  .rbc-day-bg {
    background-color: white;
  }

  .rbc-off-range-bg {
    background-color: #f7fafc;
  }

  .rbc-date-cell {
    padding: 4px 8px;
    text-align: right;
    font-size: 0.85rem;
    color: #4a5568;
  }

  .rbc-today {
    background-color: #ebf8ff;
  }

  .rbc-event {
    border-radius: 4px;
    padding: 0;
  }

  .rbc-row-segment {
    padding: 0 2px;
  }

  .rbc-button-link {
    font-weight: 500;
  }

  .rbc-now .rbc-button-link {
    background: #3182ce;
    border-radius: 50%;
    color: white;
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

const CalendarView = ({ user, company }) => {
  const localizer = momentLocalizer(moment);
  const [viewDate, setViewDate] = useState(new Date());
  const [view, setView] = useState("month");

  // Mock events for demonstration - replace with actual data
  const mockEvents = [
    {
      id: 1,
      title: "Monday Standup",
      start: new Date(2025, 0, 1, 9, 0),
      end: new Date(2025, 0, 1, 9, 30),
      type: "meeting",
    },
    {
      id: 2,
      title: "Design Sync",
      start: new Date(2025, 0, 1, 10, 0),
      end: new Date(2025, 0, 1, 10, 30),
      type: "sync",
    },
    {
      id: 3,
      title: "Coffee with Alice",
      start: new Date(2025, 0, 1, 11, 0),
      end: new Date(2025, 0, 1, 11, 30),
      type: "social",
    },
    {
      id: 4,
      title: "One-on-one call",
      start: new Date(2025, 0, 2, 10, 0),
      end: new Date(2025, 0, 2, 10, 30),
      type: "call",
    },
    {
      id: 5,
      title: "Friday Standup",
      start: new Date(2025, 0, 3, 9, 0),
      end: new Date(2025, 0, 3, 9, 30),
      type: "meeting",
    },
    {
      id: 6,
      title: "House Inspection",
      start: new Date(2025, 0, 4, 10, 0),
      end: new Date(2025, 0, 4, 11, 0),
      type: "personal",
    },
    {
      id: 7,
      title: "Team Lunch",
      start: new Date(2025, 0, 13, 12, 0),
      end: new Date(2025, 0, 13, 13, 0),
      type: "social",
    },
    {
      id: 8,
      title: "Product Planning",
      start: new Date(2025, 0, 15, 13, 0),
      end: new Date(2025, 0, 15, 14, 0),
      type: "meeting",
    },
    {
      id: 9,
      title: "Alex's Birthday",
      start: new Date(2025, 0, 12, 0, 0),
      end: new Date(2025, 0, 12, 23, 59),
      type: "allday",
    },
  ];

  // Empty events array to be populated with real data later
  const events = [];

  // Toolbar component for calendar
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate("PREV");
    };

    const goToNext = () => {
      toolbar.onNavigate("NEXT");
    };

    const goToToday = () => {
      toolbar.onNavigate("TODAY");
    };

    return (
      <Flex
        justify="space-between"
        align="center"
        p={3}
        borderBottom="1px solid"
        borderColor="gray.100"
      >
        <HStack spacing={1}>
          <Button onClick={goToBack} size="sm" variant="ghost" color="gray.600">
            <ChevronLeftIcon />
          </Button>
          <Button
            onClick={goToToday}
            size="sm"
            fontSize="sm"
            variant="solid"
            colorScheme="blue"
            borderRadius="md"
          >
            Today
          </Button>
          <Button onClick={goToNext} size="sm" variant="ghost" color="gray.600">
            <ChevronRightIcon />
          </Button>
        </HStack>

        <Text fontWeight="medium" fontSize="md">
          {toolbar.label}
        </Text>

        <HStack>
          <Button
            leftIcon={<SearchIcon />}
            size="sm"
            variant="outline"
            color="gray.600"
            fontSize="sm"
            borderRadius="md"
          >
            Search
          </Button>
          <Button
            leftIcon={<AddIcon />}
            size="sm"
            colorScheme="blue"
            fontSize="sm"
            borderRadius="md"
          >
            Add event
          </Button>
        </HStack>
      </Flex>
    );
  };

  // Custom event component to display in the calendar
  const EventComponent = ({ event }) => {
    const getEventColor = (type) => {
      switch (type) {
        case "meeting":
          return "blue";
        case "call":
          return "teal";
        case "sync":
          return "purple";
        case "social":
          return "orange";
        case "personal":
          return "green";
        case "allday":
          return "red";
        default:
          return "gray";
      }
    };

    return (
      <Box
        p={1}
        borderRadius="md"
        bg={`${getEventColor(event.type)}.50`}
        borderLeft={`3px solid`}
        borderLeftColor={`${getEventColor(event.type)}.500`}
        overflow="hidden"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        <Text fontSize="xs" fontWeight="medium" color={`${getEventColor(event.type)}.800`}>
          {!event.allDay && moment(event.start).format("h:mm A")} {event.title}
        </Text>
      </Box>
    );
  };

  // Custom event styles
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "transparent",
        border: "none",
        padding: 0,
        margin: "1px 0",
      },
    };
  };

  // Styles for the days
  const dayPropGetter = (date) => {
    const isToday = moment(date).isSame(moment(), "day");

    return {
      style: {
        backgroundColor: isToday ? "rgba(66, 153, 225, 0.05)" : undefined,
      },
    };
  };

  return (
    <Box css={calendarStyles}>
      <Calendar
        localizer={localizer}
        events={mockEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month", "week", "day"]}
        defaultView="month"
        defaultDate={moment().toDate()}
        components={{
          toolbar: CustomToolbar,
          event: EventComponent,
        }}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        onView={setView}
        onNavigate={(date) => setViewDate(date)}
      />
    </Box>
  );
};

export default CalendarView;

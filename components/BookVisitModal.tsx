import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { styled } from 'nativewind';
import { FontAwesome } from '@expo/vector-icons';
import { format, addDays } from 'date-fns';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const { width } = Dimensions.get('window');

interface BookVisitModalProps {
  visible: boolean;
  onClose: () => void;
  onBookVisit: (date: string, time: string) => void;
}

const TIME_SLOTS = [
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM"
];

const BookVisitModal: React.FC<BookVisitModalProps> = ({
  visible,
  onClose,
  onBookVisit
}) => {
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const dates: Date[] = [];
    const tomorrow = addDays(new Date(), 1);
    for (let i = 0; i < 6; i++) {
      dates.push(addDays(tomorrow, i));
    }
    setAvailableDates(dates);
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
    }
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookVisit = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      onBookVisit(formattedDate, selectedTime);
      onClose();
    }
  };

  const formatDay = (date: Date) => format(date, 'EEE').toUpperCase();
  const formatDayNumber = (date: Date) => format(date, 'd');
  const formatMonth = (date: Date) => format(date, 'MMM').toUpperCase();

  if (!visible) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={true} onRequestClose={onClose}>
      <StyledView className="flex-1 justify-end bg-black/60">
        <StyledView className="bg-[#1b1b1b] rounded-t-3xl pb-10">
          {/* Header */}
          <StyledView className="flex-row justify-between items-center p-6">
            <StyledTouchableOpacity onPress={onClose}>
              <FontAwesome name="close" size={24} color="#fff" />
            </StyledTouchableOpacity>
            <StyledText className="text-white text-xl font-semibold">Schedule a tour</StyledText>
            <StyledView className="w-6" />
          </StyledView>

          {/* Date Selection */}
          <StyledText className="text-white text-2xl font-bold px-5 mb-6">Select a date</StyledText>

          <StyledScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="mb-6"
          >
            {availableDates.map((date, index) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              return (
                <StyledTouchableOpacity
                  key={index}
                  onPress={() => handleDateSelect(date)}
                  className={`w-[110px] h-[140px] mr-4 rounded-xl items-center justify-center ${
                    isSelected ? 'border-2 border-purple-500 bg-purple-900/20' : 'border border-gray-700'
                  }`}
                >
                  <StyledText className="text-gray-400 mb-1">{formatDay(date)}</StyledText>
                  <StyledText className="text-3xl font-bold text-white">{formatDayNumber(date)}</StyledText>
                  <StyledText className="text-gray-400 mt-1">{formatMonth(date)}</StyledText>
                </StyledTouchableOpacity>
              );
            })}
          </StyledScrollView>

          {/* Time Selection */}
          {selectedDate && (
            <>
              <StyledView className="px-5 mb-6">
                <StyledText className="text-white text-2xl font-bold mb-4">Select a time</StyledText>
                <StyledScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {TIME_SLOTS.map((time, index) => {
                    const isSelected = selectedTime === time;
                    return (
                      <StyledTouchableOpacity
                        key={index}
                        onPress={() => handleTimeSelect(time)}
                        className={`mr-3 px-5 py-4 rounded-xl items-center justify-center ${
                          isSelected ? 'bg-purple-500' : 'bg-[#262626]'
                        }`}
                      >
                        <StyledText
                          className={`text-base font-medium ${
                            isSelected ? 'text-white' : 'text-gray-300'
                          }`}
                        >
                          {time}
                        </StyledText>
                      </StyledTouchableOpacity>
                    );
                  })}
                </StyledScrollView>
              </StyledView>

              {/* Book Visit Button */}
              <StyledView className="px-5">
                <StyledTouchableOpacity
                  onPress={handleBookVisit}
                  disabled={!selectedTime}
                  className={`py-4 rounded-xl flex-row justify-center items-center ${
                    selectedTime ? 'bg-purple-600' : 'bg-gray-700'
                  }`}
                >
                  <StyledText className="text-white font-medium text-base">Make visit</StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </>
          )}
        </StyledView>
      </StyledView>
    </Modal>
  );
};

export default BookVisitModal;

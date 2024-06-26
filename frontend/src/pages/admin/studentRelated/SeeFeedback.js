import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Paper, Box, Checkbox
} from '@mui/material';
import { getAllFeedbacks } from '../../../redux/feedbackRelated/feedbackHandle';
import TableTemplate from '../../../components/TableTemplate';

const SeeFeedback = () => {

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const dispatch = useDispatch();
  const { feedbackList, loading, error, response } = useSelector((state) => state.feedback);
  const { currentUser } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(getAllFeedbacks(currentUser._id, "Feedback"));
  }, [currentUser._id, dispatch]);

  if (error) {
    console.log(error);
  }

  const feedbackColumns = [
    { id: 'user', label: 'User', minWidth: 170 },
    { id: 'feedback', label: 'Feedback', minWidth: 100 },
    { id: 'date', label: 'Date', minWidth: 170 },
  ];

  const feedbackRows = feedbackList && feedbackList.length > 0 && feedbackList.map((feedback) => {
    const date = new Date(feedback.date);
    const dateString = date.toString() !== "Invalid Date" ? date.toISOString().substring(0, 10) : "Invalid Date";
    return {
      user: feedback.user.name,
      feedback: feedback.feedback,
      date: dateString,
      id: feedback._id,
    };
  });

  const FeedbackCheckbox = ({ row }) => {
    return (
      <>
        <Checkbox {...label} />
      </>
    );
  };

  return (
    <>
      {loading ?
        <div>Loading...</div>
        :
        <>
          {response ?
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              No Feedbacks Available
            </Box>
            :
            <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: '#f0f8ff' }}>
              {Array.isArray(feedbackList) && feedbackList.length > 0 &&
                <TableTemplate buttonHaver={FeedbackCheckbox} columns={feedbackColumns} rows={feedbackRows} />
              }
            </Paper>
          }
        </>
      }
    </>
  );
};

export default SeeFeedback;

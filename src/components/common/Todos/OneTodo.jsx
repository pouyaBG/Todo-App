import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteTodo from '../../../services/deleteApi';
import { PostComplatedTodo } from '../../../services/updateApi';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import DoneAllSharpIcon from '@mui/icons-material/DoneAllSharp';
import RemoveDoneSharpIcon from '@mui/icons-material/RemoveDoneSharp';
import style from './style.module.scss';
import CheckIcon from '@mui/icons-material/Check';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

// for date
const options = {
  weekday: 'long',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const OneTodo = ({
  text,
  id,
  completed,
  timeStart,
  timeEnd,
  setChange,
  pointTime,
}) => {
  const [deleteState, setDeleteState] = React.useState(false);
  const [loadingCompleted, setLoadingCompleted] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const deleteHandler = () => {
    setIsLoading(true);
    DeleteTodo(id).then((res) => {
      setChange(new Date());
      setIsLoading(false);
    });
  };

  const completedHandler = (completed) => {
    document.getElementById("card" + id).style.background = 
    completed ? "#00b10c98" : "#FA8856"
    setLoadingCompleted(true);
    PostComplatedTodo(id, {
      text: text,
      completed,
      timeStart: timeStart,
      timeEnd: completed ? new Date() : null,
      pointTime,
    })
      .then((res) => {
        setChange(new Date());
        setLoadingCompleted(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTimeStatrt = (start) => {
    document.getElementById("card" + id).style.background = "#FA8856"
    setLoadingCompleted(true);
    PostComplatedTodo(id, {
      text: text,
      completed,
      timeStart: start ? new Date() : null,
      timeEnd: null,
      pointTime,
    })
      .then((res) => {
        setChange(new Date());
        setLoadingCompleted(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getLengthTime(end, start) {
    const Delta = Math.abs(new Date(end) - new Date(start));

    let result;
    let min = Delta / 1000 / 60;

    if (min < 1) {
      result = Math.floor(Delta / 1000) + 'ثانیه';
    } else if (min < 60) {
      result = Math.floor(min) + 'دقیقه';
    } else if (min > 60) {
      result = Math.floor(min / 60) + 'ساعت';
    } else if (min / 60 / 24 > 1) {
      result = Math.floor(min / 60 / 24) + 'روز';
    }

    return result;
  }

  function handleDelete() {
    setDeleteState(true);
    setTimeout(() => {
      setDeleteState(false);
    }, 4000);
  }

  return (
    <div className={style.box_todo} style={{ margin: 10 }}>
      <Card 
        sx={{
          minWidth: 275,
          maxWidth: 325,
          backgroundColor: '#fff4',
          backdropFilter: 'blur(16px)',
          borderRadius: 5,
        }}>
        {pointTime == null ? (
          ''
        ) : (
          <Tooltip title='زمان هدف'>
            <span className={style.timeaccest}>
              <p>{pointTime}</p>
              <AccessTimeIcon />
            </span>
          </Tooltip>
        )}
        <CardContent
        id={"card" + id}
          sx={{
            backgroundColor: `${
              timeStart == null
                ? '#1d8eff94'
                : completed
                ? '#00b10c98'
                : '#FA8856'
            }`,
          }}
          className={style.body}
          onClick={handleClickOpen}>
          <Typography variant='body1' className={style.text_body}>
            {text}
          </Typography>

          <Typography variant='body2' component='div' marginTop={2}>
            شروع:
            <br></br>
            {timeStart == null
              ? 'شروع نشده است'
              : new Date(timeStart).toLocaleString('fa-IR', options)}
          </Typography>
          <Typography variant='body2' component='div' marginTop={2}>
            <p>پایان:</p>
            {completed
              ? new Date(timeEnd).toLocaleString('fa-IR', options)
              : '  به پایان نرسیده است'}
          </Typography>
        </CardContent>
        <CardActions>
          <div className={style.card_actions}>
            <IconButton size='small' color='error'>
              {!deleteState ? (
                <Tooltip title='حدف'>
                  <DeleteIcon onClick={handleDelete} />
                </Tooltip>
              ) : (
                <Tooltip title='مطمئنید'>
                  {!isLoading ? (
                    <GppMaybeRoundedIcon onClick={deleteHandler} />
                  ) : (
                    <CircularProgress sx={{ color: 'red' }} size={22} />
                  )}
                </Tooltip>
              )}
            </IconButton>
            <span>
              {timeEnd == null ? '' : getLengthTime(timeEnd, timeStart)}
            </span>
            {loadingCompleted ? (
              <CircularProgress size={22} />
            ) : timeStart == null ? (
              <Tooltip title='شروع'>
                <IconButton
                  size='small'
                  color='info'
                  onClick={() => handleTimeStatrt(true)}>
                  <CheckIcon sx={{ color: '#d35400' }} />
                </IconButton>
              </Tooltip>
            ) : !completed ? (
              <Tooltip title='تکمیل کردن'>
                <IconButton
                  size='small'
                  color='info'
                  onClick={() => completedHandler(true)}>
                  <DoneAllSharpIcon sx={{ color: 'green' }} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title='تکمیل نشده'>
                <IconButton
                  size='small'
                  color='info'
                  onClick={() => completedHandler(false)}>
                  <RemoveDoneSharpIcon sx={{ color: '#d35400' }} />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </CardActions>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>متن کامل فعالیت شما</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Tooltip title='ویرایش'>
            <IconButton onClick={handleClose} autoFocus>
              <ModeEditIcon />
            </IconButton>
          </Tooltip>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(OneTodo);

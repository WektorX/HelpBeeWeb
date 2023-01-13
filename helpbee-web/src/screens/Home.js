import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userUID, userAuth, userType } from '../redux/actions/userDataAction';
import { auth } from '../firebase/firebase';
import '../styles/home.css'
import SegmentedControl from "../components/SegmentedControl";
import Table from "../components/Table";
import { getReportedOffers, getBlockedOffers, getAllOffers, getAllUsers } from '../api/get';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from 'react-loader-spinner'
import { setBlockOffer, setReviewedOffer, setPermissions } from '../api/post';
const Home = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uid = useSelector((store) => store.user.uid);
  const authObj = useSelector((store) => store.user.auth)
  const type = useSelector((store) => store.user.userType)

  const [selectedValue, setSelectedValue] = useState("reported");

  const [reported, setReported] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [offers, setOffers] = useState([]);
  const [users, setUsers] = useState([]);

  const [rows, setRows] = useState([]);
  const [headCells, setHeadCells] = useState([]);

  const [status, setStatus] = useState("loading");

  const [selected, setSelected] = useState(null);
  const [showEdit, setShowEdit] = useState(false);

  const [usersType, setUsersType] = useState("");
  const [userBlocked, setUserBlocked] = useState(false);


  const moderatorSegements = [
    {
      label: "Reported offers",
      value: "reported",
      ref: useRef()
    },
    {
      label: "Blocked offers",
      value: "blocked",
      ref: useRef()
    },
    {
      label: "All offers",
      value: "offers",
      ref: useRef()
    }
  ]
  const adminSegments = [
    {
      label: "Reported offers",
      value: "reported",
      ref: useRef()
    },
    {
      label: "All offers",
      value: "offers",
      ref: useRef()
    },
    {
      label: "Blocked offers",
      value: "blocked",
      ref: useRef()
    },
    {
      label: "Users",
      value: "users",
      ref: useRef()
    }
  ]
  useEffect(() => {
    if (uid === "" && authObj === null && sessionStorage.getItem("auth") !== null) {
      let temp = JSON.parse(sessionStorage.getItem("auth"));
      dispatch(userAuth(temp));
      dispatch(userUID(temp.uid))
      dispatch(userType(sessionStorage.getItem("userType")))
      retriveReported();
    }
    else {
      if (uid === "" && sessionStorage.getItem("auth") === null) {
        navigate("login")
      }
      else {
        retriveReported();
      }
    }

  }, [])



  const retriveReported = async () => {
    const response = await getReportedOffers();
    let reported = response.data;
    setReported(reported)
    if (reported.length > 0) {
      let rows = reported.map((item, id) => {
        return {
          id: item.id,
          category: item.category,
          title: item.title,
          user: item.firstName + " " + item.lastName,
          number_of_reports: item.reportedBy.length,
          date: new Date(item.publicationDate).toISOString()?.slice(0, 10)
        }
      })
      createHeadCells(rows)
      setRows(rows)
    }
    else {
      setRows([])
      setHeadCells([])
      setStatus("loaded")
    }
  }

  const retriveBlocked = async () => {
    const response = await getBlockedOffers();
    let blocked = response.data;
    setBlocked(blocked)
    if (blocked.length > 0) {
      let rows = blocked.map((item, id) => {
        return {
          id: item.id,
          category: item.category,
          title: item.title,
          user: item.firstName + " " + item.lastName,
          number_of_reports: item.reportedBy.length,
          date: new Date(item.publicationDate).toISOString().slice(0, 10)
        }
      })
      createHeadCells(rows)
      setRows(rows)
    }
    else {
      setRows([])
      setHeadCells([])
      setStatus("loaded")
    }
  }


  const retriveAll = async () => {
    const response = await getAllOffers();
    let offers = response.data;
    setOffers(offers)
    if (offers.length > 0) {
      let rows = offers.map((item, id) => {
        return {
          id: item.id,
          category: item.category,
          title: item.title,
          user: item.firstName + " " + item.lastName,
          number_of_reports: item.reportedBy.length,
          date: new Date(item.publicationDate).toISOString().slice(0, 10),
          blocked: item.blocked ? 'Yes' : 'No',
          reviewed: item.reviewed ? 'Yes' : 'No'
        }
      })
      createHeadCells(rows)
      setRows(rows)
    }
    else {
      setRows([])
      setHeadCells([])
      setStatus("loaded")
    }
  }

  const retriveUsers = async () => {
    const response = await getAllUsers();
    let users = response.data;
    setUsers(users)
    if (users.length > 0) {
      let rows = users.map((item, id) => {
        return {
          id: item.id,
          firstName: item.firstName,
          lastName: item.lastName,
          email: item.email,
          type: item.userType,
          blocked: item.blocked ? 'Blocked' : 'Active',
        }
      })
      createHeadCells(rows)
      setRows(rows)
    }
    else {
      setRows([])
      setHeadCells([])
      setStatus("loaded")
    }
  }

  const createHeadCells = (list) => {
    let item = list[0];
    let headCells = [];
    for (const key in item) {
      let cell = {
        id: key,
        disablePadding: false,
        label: keyToLabel(key),
      }
      headCells.push(cell);
    }
    setHeadCells(headCells)
    setTimeout(() => {
      setStatus("loaded")
    }, 500)
  }

  const keyToLabel = (key) => {
    let parts = key.split("_");
    parts[0] = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    return parts.join(" ");
  }



  const handleSignOut = () => {

    auth
      .signOut()
      .then(() => {
        sessionStorage.removeItem("auth");
        window.location.reload();
      })
      .catch(err => alert(err.message))
  }


  const handleOfferClick = (id) => {
    let temp = [];
    switch (selectedValue) {
      case 'reported':
        temp = reported;
        break;
      case 'blocked':
        temp = blocked;
        break;
      case 'offers':
        temp = offers;
        break;
      case 'users':
        temp = users
        break;
    }
    let index = temp.findIndex(item => item.id === id);
    if (selectedValue === 'users') {
      setUsersType(temp[index].userType)
      setUserBlocked(temp[index].blocked)
    }
    setSelected(temp[index]);
    setShowEdit(true);
  }


  const handleSelectedChange = (selected) => {
    setStatus('loading')
    refresh(selected);
    setSelectedValue(selected)
  }

  const handleClose = () => {
    setShowEdit(false);
  };

  const handleBlock = async () => {
    const response = await setBlockOffer(selected.id, !selected.blocked)
    refresh(selectedValue)
    setShowEdit(false);
  };

  const handleReviewed = async () => {
    const response = await setReviewedOffer(selected.id);
    refresh(selectedValue)
    setShowEdit(false);
  };

  const handleSave = async () => {
    const response = await setPermissions(selected.id, usersType, userBlocked);
    refresh(selectedValue);
    setShowEdit(false);
  }

  const refresh = (selected) => {
    switch (selected) {
      case 'reported':
        retriveReported();
        break;
      case 'blocked':
        retriveBlocked();
        break;
      case 'offers':
        retriveAll();
        break;
      case 'users':
        retriveUsers();
        break;
    }
  }

  return (
    <div className="App">
      <div className='header' >
        <button onClick={handleSignOut}>Log out</button>
      </div>
      <div className='tabBar'>
        <SegmentedControl
          name="group-1"
          callback={(val) => handleSelectedChange(val)}
          controlRef={useRef()}
          segments={type === 'superadmin' ? adminSegments : moderatorSegements}
        />
      </div>

      {status === 'loading' ?
        <div className='spinner'>
          <Grid
            height="100"
            width="100"
            color="#ffcb05"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
        :
        <div className='table'>
          <Table rows={rows} headCells={headCells} handleClick={handleOfferClick} />
        </div>}

      {selectedValue !== 'users' ?
        <Dialog
          open={showEdit && selected !== null && selectedValue !== "users"}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Offer details"}
          </DialogTitle>
          <DialogContent>
            <p><b className='dialog-label'>Title:</b> {selected?.title}</p>
            <br />
            <p><b className='dialog-label'>Description:</b>  {selected?.description}</p>
            <br />
            <p><b className='dialog-label'>Created by:</b>  {selected?.firstName + " " + selected?.lastName}</p>
            <br />
            <p><b className='dialog-label'>Created:</b>  {selected?.publicationDate?.slice(0, 10)}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBlock}>{selected?.blocked ? 'Unblock' : 'Block'}</Button>
            {selected?.reviewed ? null : <Button onClick={handleReviewed} autoFocus>Accept</Button>}
            <Button onClick={handleClose}>Close</Button>

          </DialogActions>
        </Dialog>
        :
        <Dialog
          open={showEdit && selected !== null && selectedValue === "users"}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"User details"}
          </DialogTitle>
          <DialogContent>
            <p><b className='dialog-label'>First name:</b> {selected?.firstName}</p>
            <br />
            <p><b className='dialog-label'>Last name:</b>  {selected?.lastName}</p>
            <br />
            <p><b className='dialog-label'>Email address:</b>  {selected?.email}</p>
            <br />
            <div><b className='dialog-label'>Type:</b>
              <select disabled={selected?.id === uid} defaultValue={selected?.userType} onChange={(e) => setUsersType(e.target.value)} className="user-type">
                <option value={'normal'}>Normal</option>
                <option value={'moderator'}>Moderator</option>
                <option value={'superadmin'}>Superadmin</option>
              </select>
            </div>
            <div><b className='dialog-label'>Blocked:</b>
              <input type={'checkbox'} checked={userBlocked} onChange={(e) => setUserBlocked(e.target.checked)}/>
            </div>
          </DialogContent>
          <DialogActions>
            {usersType && usersType !== "" && (usersType !== selected?.userType || userBlocked != selected?.blocked) && selected?.id !== uid ? <Button onClick={handleSave}>Save</Button> : null}

            <Button onClick={handleClose}>Close</Button>

          </DialogActions>
        </Dialog>
      }
    </div>
  );
}

export default Home;

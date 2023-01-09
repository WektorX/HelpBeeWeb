import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userUID, userAuth, userType } from '../redux/actions/userDataAction';
import { auth } from '../firebase/firebase';
import '../styles/home.css'
import SegmentedControl from "../components/SegmentedControl";
import Table from "../components/Table";
import { getReportedOffers, getBlockedOffers, getAllOffers, getAllUsers } from '../api/get';
import { Grid } from 'react-loader-spinner'
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
  const [headCells, setHeadCells] = useState([])

  const [status, setStatus] = useState("loading")

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
      dispatch(userType(temp.type))
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
          date: new Date(item.publicationDate).toISOString().slice(0, 10)
        }
      })
      createHeadCells(rows)
      setRows(rows)
    }
    else {
      setRows([])
      setHeadCells([])
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
          blocked : item.blocked? 'Yes' : 'No'
        }
      })
      createHeadCells(rows)
      setRows(rows)
    }
    else {
      setRows([])
      setHeadCells([])
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
        }
      })
      createHeadCells(rows)
      setRows(rows)
    }
    else {
      setRows([])
      setHeadCells([])
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
    setTimeout(()=>{
      setStatus("loaded")
    },500)
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
    console.log(id);
  }

  const handleSelectedChange = (selected) => {
    setStatus('loading')
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
      default:
        console.log("Xd");
    }

    setSelectedValue(selected)
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


    </div>
  );
}

export default Home;

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userUID, userAuth, userType } from '../redux/actions/userDataAction';
import { store } from '../redux/store';
import { auth } from '../firebase/firebase';
import Welcome from './Welcome';
import '../styles/home.css'
import SegmentedControl from "../components/SegmentedControl";
import { getReportedOffers } from '../api/get';
const Home = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const uid = useSelector((store) => store.user.uid);
  const authObj = useSelector((store) => store.user.auth)
  const type = useSelector((store) => store.user.userType)
  

  const [selectedValue1, setSelectedValue1] = useState("reported");
  const [reported, setReported] = useState([]);


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
    else{
      if (uid === "" && sessionStorage.getItem("auth") === null) {
        navigate("login")
      }
      else{
        retriveReported();
      }
    }

  }, [])



  const retriveReported = async() => {
    const response = await getReportedOffers();
    console.log(response)
  }

  const handleSignOut = () => {

    auth
      .signOut()
      .then(() => {
        console.log("XD")
        sessionStorage.removeItem("auth");
        window.location.reload();
      })
      .catch(err => alert(err.message))
  }

  return (
    <div className="App">
      <div className='header' >
        <button onClick={handleSignOut}>Log out</button>
      </div>
      <div className='tabBar'>
        <SegmentedControl
          name="group-1"
          callback={(val) => setSelectedValue1(val)}
          controlRef={useRef()}
          segments={ type === 'superadmin' ? adminSegments : moderatorSegements}
        />
      </div>

      <div>

      </div>

    </div>
  );
}

export default Home;

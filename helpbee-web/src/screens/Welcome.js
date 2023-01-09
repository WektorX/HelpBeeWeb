import React from 'react'
import { useSelector } from 'react-redux';

const Welcome = () => {

    const uid = useSelector((store) => store.user.uid);
  return (
    <div>Welcome</div>
  )
}

export default Welcome
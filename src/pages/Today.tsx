import React, { useState } from 'react'
import TaskInfo from '../components/Task/TaskInfo'

function Today() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div>
      <button onClick={() => setShowModal(true)}>Show modal</button>
      {
       showModal && <TaskInfo setShowModal={setShowModal}/>
      }
    </div>
  )
}

export default Today
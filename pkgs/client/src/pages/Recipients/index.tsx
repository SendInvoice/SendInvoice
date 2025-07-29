import { FaPlus } from 'react-icons/fa'
import Navbar from '../Auth/components/Navbar'
import './Recipients.css'

export default function Recipients() {

    return (
        <div>
            <Navbar/>
            <h2 className='h2'><FaPlus/> Add a new Recipient</h2>
        </div>
    )
}

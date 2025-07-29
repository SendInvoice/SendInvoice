import { FaPlus } from 'react-icons/fa'
import Navbar from '../Auth/components/Navbar'
import './Invoice.css'

export default function Invoice() {

    return (
        <div>
            <Navbar/>
            <h2 className='h2'><FaPlus/> Create a new Invoice</h2>
        </div>
    )
}

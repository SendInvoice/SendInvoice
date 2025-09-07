import Navbar from '../../Auth/components/Navbar'
import { FaEdit } from 'react-icons/fa'

import './updateRecipients.css'

export default function UpdateRecipients() {

    return (
        <div>
            <Navbar />
            <h2 className='h2'><FaEdit /> Update a Recipient</h2>
            <span>Find the recipient you want to update</span>
            <select></select>
        </div>
    );
}
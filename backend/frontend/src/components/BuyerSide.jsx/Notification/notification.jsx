import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

import "./index.css"
import image from "./hania.jpg"
export default function NotificationCard(props){
    const navigate=useNavigate();
    const CloseAdd =() =>{
            alert("it ran");
    }
    function naviagtor(){
        navigate('/product-detail', {
            state: {
              id: props.productId,
              parentCollection: { name: props.brandName, id: 1 }
            }
          });
          
    }
    return(
        <div className="notification-ads-container">
            <img onClick={naviagtor}src={props.image} alt="ad image" />
            <div onClick={naviagtor}>
                <h6>{props.brandName}</h6>
                <p>{props.productTitle}</p>
            </div>
            <div onClick={props.CloseFun}>
                <CloseIcon className='close-add'/>
            </div>
        </div>
    )
}
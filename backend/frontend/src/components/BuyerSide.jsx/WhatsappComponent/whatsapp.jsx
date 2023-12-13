import "./index.css"
import icon from "./whatsapp-icon.png"
export default function WhatsAppPopUp(){
    function navigator(){
        window.open("https://wa.me/923333694455", "_blank");
    }
    return(
        <div onClick={navigator} className="whatsapp-container">
            <h6>Chat with Us</h6>
            <img src={icon} alt="whats app icon" />
        </div>
    )
}
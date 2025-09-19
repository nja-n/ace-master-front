import homeIcon from '../../images/icons/home.png';
import backIcon from '../../images/icons/back.png';
import dotIcon from '../../images/icons/dots.png';
import questionIcon from '../../images/icons/question.png';
import lockIcon from '../../images/icons/lock.png';
import timesIcon from '../../images/icons/times.png';

const ImageIcon = ({icon, onclick}) => {
    let iconImage;
    switch (icon) {
        case "home":
            iconImage = homeIcon;
            break;
        case "back":
            iconImage = backIcon;
            break;
        case "lock":
            iconImage = lockIcon;
            break;
        default:
            iconImage = backIcon;
            break;
    }
    return (
        <img src={iconImage} width={33} height={33}
            onClick={onclick} style={{ cursor: "pointer" }}
        />
    );
}

export default ImageIcon;
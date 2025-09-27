import homeIcon from '../../images/icons/home.png';
import backIcon from '../../images/icons/back.png';
import dotIcon from '../../images/icons/dots.png';
import questionIcon from '../../images/icons/question.png';
import lockIcon from '../../images/icons/lock.png';
import timesIcon from '../../images/icons/times.png';
import leaderImg from '../../images/leader.png';
import cartImg from '../../images/carts.png';
import { useSound } from '../utils/SoundProvider';
import { IconButton } from '@mui/material';

const ImageIcon = ({ icon, onclick, content }) => {
    const { playSound } = useSound();

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
        case "dot":
            iconImage = dotIcon;
            break;
        case "question":
            iconImage = questionIcon;
            break;
        case "times":
            iconImage = timesIcon;
            break;
        case "leader":
            iconImage = leaderImg;
            break
        case "cart":
            iconImage = cartImg;
            break;
        default:
            iconImage = null;
            break;
    }

    const handleOnClick = () => {
        playSound("click");
        onclick();
    }

    return (
        iconImage ?
            <img src={iconImage} width={33} height={33}
                onClick={() => handleOnClick()} style={{ cursor: "pointer" }}
            /> :
            <IconButton>{content}</IconButton>
    );
}

export default ImageIcon;
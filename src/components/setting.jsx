import styles from "@/styles/setting.module.css";
import propTypes from "prop-types";
import { Switch, styled } from "@mui/material";

// https://mui.com/material-ui/react-switch/#customization
const ThemedSwitch = styled(Switch)(() => ({
	"& .MuiSwitch-switchBase": {
		"&.Mui-checked": {
			color: "var(--primary)",
			"& + .MuiSwitch-track": {
				backgroundColor: "var(--primary)",
			},
		},
	},
}));

function InputSwitch({ onChange, isChecked, disabled }) {
	return <ThemedSwitch onChange={onChange} checked={!!isChecked} disabled={disabled} size="medium" />;
}

InputSwitch.propTypes = {
	onChange: propTypes.func,
	isChecked: propTypes.bool,
	disabled: propTypes.bool,
};

export { InputSwitch };

function Setting({ children, name, description }) {
	return (
		<div className={styles.setting}>
			<div className={styles.details}>
				<span className={styles.name}>{name}</span>
				{description && <span className={styles.description}>{description}</span>}
			</div>
			{children}
		</div>
	);
}

Setting.propTypes = {
	children: propTypes.any,
	name: propTypes.string.isRequired,
	description: propTypes.string,
};

export default Setting;

import React, {useState} from 'react';
import { View } from 'react-native';
import Styles from '../StyleSheet';
import { Dropdown } from 'react-native-element-dropdown';

const DropDown = ({data, labelFd, valueFd, setValue, value}) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View>
        <Dropdown
          style={[Styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={Styles.placeholderStyle}
          selectedTextStyle={Styles.selectedTextStyle}
          inputSearchStyle={Styles.inputSearchStyle}
          iconStyle={Styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField={labelFd}
          valueField={valueFd}
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item[valueFd]);
            setIsFocus(false);
          }}
        />
      </View>
    )
}

export default DropDown;

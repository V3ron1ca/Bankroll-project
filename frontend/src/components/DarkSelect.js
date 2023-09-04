import Select from "react-select";


function DarkSelect({options, onChange, value}) {
    
    return ( <Select
        id="selector"
        options={options}
        onChange={onChange}
        value={value}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
              backgroundColor: "rgba(0,0,0,.5)",
              border: "1px solid #2ceef0",
              margin: "5px 0",
              fontSize: "19px",
              color: "white",
              width: "300px",
              maxWidth: "300px",
          }),
          placeholder:  (baseStyles, state) => ({
            ...baseStyles,
            color: "white"
          }),
          menu:  (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "rgba(0,0,0,.9)",
            color: "white"
          }),
          singleValue:  (baseStyles, state) => ({
            ...baseStyles,
            color: "white",
          }),
          input:  (baseStyles, state) => ({
            ...baseStyles,
            color: "white"
          }),
          option:  (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state?.isFocused ? "#2ceef0": "none",
            
          }),
        }}
      />)
}

export default DarkSelect;
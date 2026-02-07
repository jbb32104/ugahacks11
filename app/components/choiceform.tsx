

const ChoiceForm = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className =" bg-white pl-20 pr-20 pt-10 pb-10 m-50 rounded text-black center-content">
                <label className= "text-lg p-2 m-2 rounded border-5 border-sky-500" htmlFor="soundChoice">Pick an audio to play!</label>
                <fieldset className = "flex flex-col items-center" id = "soundChoice">
                    <div className = "m-6">
                        <div className = "flex flex-row">
                                <input className ="mr-10"type="radio" name = "sound" id = "choice1"></input>
                                <label htmlFor="choice1">HOOYAHH</label>
                        </div>
                        <div className = "flex flex-row">
                            <input className ="mr-10" name = "sound" type="radio" id = "choice2"></input>
                            <label htmlFor="choice2">fart</label>
                        </div>                    
                        <div className = "flex flex-row">
                            <input className ="mr-10" name = "sound" type="radio" id = "choice3"></input>
                            <label htmlFor="choice3">hawk tuah</label>
                        </div>
                     </div>
                </fieldset>
            </div>
        </div>
    );
}

export default ChoiceForm;
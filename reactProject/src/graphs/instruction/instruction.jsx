import './instruction.css'

export default function Instruction(){

    return (
        <div id='instruction'>
            <h1>Instructions</h1>
            <h2>Upload User Data</h2>
            <ul>
                <li>Select a chart from the left panel.</li>
                <li>If available, find the <span>Upload Excel Data</span> button in the lower right corner.</li>
                <li>Clicking the button reveals the sample data used to generate the chart.</li>
                <li>You can upload your own Excel or CSV file, ensuring it matches the displayed data's format.</li>
                <li>Alternatively, download the sample data for convenient updates.</li>
                <li>Finish by clicking the <span>Generate Chart</span> button.</li>
            </ul>
            <h2>Download Chart as Image</h2>
            <ul>
                <li>Click the <span>Download Image</span> button and wait a few seconds for the download to initiate.</li>
            </ul>

            <h2>Adjust Chart Alignment</h2>
            <ul>
                <li>In the lower middle area, you'll find two buttons that shift the chart left or right by 10 pixels per click.</li>
                <li>This feature helps align the image properly if needed.</li>
            </ul>
            <h2>Toolbar Functionality</h2>
            <ul>
                <li>Located on the right side panel.</li>
                <li>The toolbar allows you to interact with the chart UI and provides various functions such as darkmode, data range and etc.</li>
            </ul>
        </div>
    )

}
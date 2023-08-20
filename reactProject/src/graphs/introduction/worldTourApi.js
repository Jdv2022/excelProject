const apiBaseUrl = import.meta.env.VITE_CI_BASE_URL
const worldwpopulation = "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/population%20with%20world.json"
const worldborders = "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/borders%20(1).json"
const land = "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/land%20(1).json"
const world = "https://raw.githubusercontent.com/Jdv2022/d3js-worldTour/main/world%20(1).json"

export default async function Api(){
    try {
        const response1 = await fetch(worldwpopulation, {
            method: 'GET'
        })
        const response2 = await fetch(worldborders, {
            method: 'GET'
        })
        const response3 = await fetch(land, {
            method: 'GET'
        })
        const response4 = await fetch(world, {
            method: 'GET'
        })
        if (response1.ok && response2.ok && response3.ok && response4.ok) {
            const viewData1 = await response1.json()
            const viewData2 = await response2.json()
            const viewData3 = await response3.json()
            const viewData4 = await response4.json()

            const thisData = {
                'data0' : viewData1,
                'data1' : viewData2,
                'data2' : viewData3,
                'data3' : viewData4,
            }

            return thisData
        } 
        else {
            throw new Error('Request failed')
        }
    } 
    catch (error) {
        if( error.response ){
            console.log(error.response.data); // => the response payload 
        }
    }
    return null // Return your desired JSX or component here if needed
}
// controllers/dataController.js

const handleReceivedData = (data) => {
    console.log("Received Data from Java:", data);
    // You can log or process the data further here if needed.
};

const getMutualsSuggestions = (req, res) => {
    try {
        // const data = req.body;  // Data sent from Java (mutuals and suggestions)
        //
        // console.log("Processing received data from Java...");
        //
        // // Call the function to handle the received data
        // handleReceivedData(data);
        //
        // // Send back a success response
        // res.status(200).json({
        //     message: 'Data processed successfully',
        //     receivedData: data
        // });
        res.json({message: "hello world"});

    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ message: 'Error processing data' });
    }
};

module.exports = { getMutualsSuggestions };

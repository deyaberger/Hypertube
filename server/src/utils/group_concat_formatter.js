
function csv_to_array(data, csv_property_name) {
	try {
		if (data[csv_property_name] === null) {
			data[csv_property_name] = []
		}
		else {
			data[csv_property_name] = data[csv_property_name].split(",")
		}
	}
	catch {
	}
	return data
	
}

function transform_csv_lists_to_arrays(data, attributes_to_transform) {
	for (const property_name of attributes_to_transform) {
		data = csv_to_array(data, property_name)
	}
	return data
}

module.exports = {
    csv_to_array,
    transform_csv_lists_to_arrays
}
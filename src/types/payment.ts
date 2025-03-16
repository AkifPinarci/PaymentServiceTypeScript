export type PaymentRequestBody = {
	customer_id: string;
	success_url: string;
	cancel_url: string;
	new_payment?: string;
	items: Item[];
};

type Item = {
	quantity: number;
	price_data: Pricedata;
};

type Pricedata = {
	unit_amount: number;
	currency: string;
	product_data: Productdata;
};

type Productdata = {
	name: string;
};

export type PaymentQueryParams = {
	payerid: string;
	status: string;
	offset: string;
	limit: string;
};

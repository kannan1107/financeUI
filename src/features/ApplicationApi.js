import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Customers", "Transactions", "Receipt"],
  endpoints: (builder) => ({
    // Auth
    register: builder.mutation({
      query: (userData) => ({
        url: "/api/user/register",
        method: "POST",
        body: userData,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/api/user/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Customers
    addCustomer: builder.mutation({
      query: (customerData) => ({
        url: "/api/custom/customRegister",
        method: "POST",
        body: customerData,
      }),
    }),

    updateCustomer: builder.mutation({
      query: ({ id, ...customerData }) => ({
        url: `/api/custom/updateCustomData/${id}`,
        method: "PUT",
        body: customerData,
      }),
    }),

    deleteCustomer: builder.mutation({
      query: (customerId) => ({
        url: `/api/custom/deleteCustomData/${customerId}`,
        method: "DELETE",
      }),
    }),

    fetchCustomers: builder.query({
      query: () => "/api/customers",
    }),

    fetchCustomerById: builder.query({
      query: (customerId) => `/api/customers/${customerId}`,
    }),

    // get all customers  all details
    fetchAllCustomers: builder.query({
      query: () => "/api/custom/allCustomerDetails",
      providesTags: ["Customers"],
    }),

    // get customer transactions by ID
    fetchCustomerTransactions: builder.query({
      query: (customerId) => `/api/emi/getEmiWithCustomer/${customerId}`,
      providesTags: (result, error, customerId) => [{ type: "Transactions", id: customerId }],
    }),

    // get next receipt no
    fetchNextReceiptNo: builder.query({
      query: (customerId) => `/api/emi/getNextReceiptNo?customerId=${customerId}`,
      providesTags: (result, error, customerId) => [{ type: "Receipt", id: customerId }],
    }),

    // EMI
    calculateEMI: builder.mutation({
      query: (emiData) => ({
        url: "/api/emi/calculate",
        method: "POST",
        body: emiData,
      }),
    }),

    // Payments
    makePayment: builder.mutation({
      query: (paymentData) => ({
        url: "/api/emi/emiRegister",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: (result, error, paymentData) => [
        "Customers",
        { type: "Transactions", id: paymentData?.newCustomerId },
        { type: "Receipt", id: paymentData?.newCustomerId },
      ],
    }),

    // Loan
    forecloseLoan: builder.mutation({
      query: (payload) => ({
        url: "/api/emi/forecloseLoan",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, payload) => [
        "Customers",
        { type: "Transactions", id: payload?.newCustomerId || payload?.customer_id || payload?.customerId },
        { type: "Receipt", id: payload?.newCustomerId || payload?.customer_id || payload?.customerId },
      ],
    }),

    updateLoanStatus: builder.mutation({
      query: (loanData) => ({
        url: "/api/loans/update-status",
        method: "PUT",
        body: loanData,
      }),
    }),
  }),
});

export const {
  useFetchCustomerTransactionsQuery,
  useFetchNextReceiptNoQuery,
  useRegisterMutation,
  useLoginMutation,
  useAddCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useFetchCustomersQuery,
  useFetchCustomerByIdQuery,
  useCalculateEMIMutation,
  useMakePaymentMutation,
  useForecloseLoanMutation,
  useUpdateLoanStatusMutation,
  useFetchAllCustomersQuery,
} = appApi;

export default appApi;

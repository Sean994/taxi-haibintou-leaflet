export const fbqViewContent = () => {
    window.fbq('track', 'ViewContent')
}

export const fbqTaxiDataCall = (a, b, c, d) => {
    window.fbq(
        'trackCustom',
        'Taxi Data',
        {dataLength: a, dataRes: b, dataStartTime: c, dataStartDate: d}
    )
}

const mockData = [
  { id: '1', pdf: '/path/to/pdf1.pdf', status: 'Approved' },
  { id: '2', pdf: '/path/to/pdf2.pdf', status: 'Pending' },
  { id: '3', pdf: '/path/to/pdf3.pdf', status: 'Rejected' },
];

export default {
  get: (url: string) => {
    if (url === '/mock/api') {
      return Promise.resolve({ data: mockData });
    }
    return Promise.reject(new Error('Not found'));
  },
};
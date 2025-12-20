"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  DatePicker,
  Select,
  Popconfirm,
  Dropdown,
  Checkbox,
  Tag,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  addSemesterAction,
  deleteSemesterAction,
  editSemesterAction,
  getAllSemesterAction,
} from "../redux/actions/SemesterAction";
import { BiRecycle } from "react-icons/bi";

export default function Semester() {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const semesters = useSelector((state) => state.SemesterReducer.semesters);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [visibleColumns, setVisibleColumns] = useState({
    // id: true,
    stt: true,
    year: true,
    semesters: true,
    start_date: true,
    end_date: true,
    is_deleted: true,
    created_at: false,
    updated_at: false,
    open_date: true,
    close_date: true,
  });

  useEffect(() => {
    dispatch(getAllSemesterAction(statusFilter));
  }, [dispatch, statusFilter]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      start_date: record.start_date ? dayjs(record.start_date) : null,
      end_date: record.end_date ? dayjs(record.end_date) : null,
      open_date: record.open_date ? dayjs(record.open_date) : null,
      close_date: record.close_date ? dayjs(record.close_date) : null,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        start_date: values.start_date
          ? values.start_date.format("YYYY-MM-DD")
          : null,
        end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
        open_date: values.open_date
          ? values.open_date.format("YYYY-MM-DD")
          : null,
        close_date: values.close_date
          ? values.close_date.format("YYYY-MM-DD")
          : null,
      };

      if (editingRecord) {
        const newValues = { ...editingRecord, ...formattedValues };
        const res = await dispatch(
          editSemesterAction(editingRecord.id, newValues)
        );
        if (res.success) {
          messageApi.success("Sửa thành công!");
          dispatch(getAllSemesterAction(statusFilter));
        } else {
          messageApi.error("Sửa thật bại!");
        }
      } else {
        const res = await dispatch(addSemesterAction(formattedValues));
        if (res.success) {
          messageApi.success("Thêm thành công!");
          dispatch(getAllSemesterAction(statusFilter));
        } else {
          messageApi.error(res?.error?.response?.data?.message);
        }
      }
      setIsModalVisible(false);
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteSemesterAction(id));
    if (res.success) {
      messageApi.success("Thành công!");
      dispatch(getAllSemesterAction(statusFilter));
    } else {
      messageApi.error("Thất bại!");
    }
  };

  const filteredData = semesters.filter((semester) => {
    const searchLower = searchText.toLowerCase();
    return (
      semester.year?.toString().includes(searchLower) ||
      semester.semesters?.toLowerCase().includes(searchLower) ||
      semester.start_date?.includes(searchLower) ||
      semester.end_date?.includes(searchLower)
    );
  });

  const handleStatus = (value) => {
    setStatusFilter(value);
    if (value === "all") {
      dispatch(getAllSemesterAction({}));
    } else if (value === "active") {
      dispatch(getAllSemesterAction(statusFilter));
    } else {
      dispatch(getAllSemesterAction(statusFilter));
    }
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // const columnMenu = {
  //   items: Object.keys(visibleColumns).map((key) => ({
  //     key,
  //     label: (
  //       <Checkbox
  //         checked={visibleColumns[key]}
  //         onChange={() => toggleColumn(key)}
  //       >
  //         {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
  //       </Checkbox>
  //     ),
  //   })),
  // };

  const columnMenu = {
    items: [
      // {
      //   key: "id",
      //   label: (
      //     <Checkbox
      //       checked={visibleColumns.id}
      //       onChange={() => toggleColumn("id")}
      //     >
      //       ID
      //     </Checkbox>
      //   ),
      // },
      {
        key: "stt",
        label: (
          <Checkbox
            checked={visibleColumns.stt}
            onChange={() => toggleColumn("stt")}
          >
            stt
          </Checkbox>
        ),
      },
      {
        key: "year",
        label: (
          <Checkbox
            checked={visibleColumns.year}
            onChange={() => toggleColumn("year")}
          >
            Năm học
          </Checkbox>
        ),
      },
      {
        key: "semesters",
        label: (
          <Checkbox
            checked={visibleColumns.semesters}
            onChange={() => toggleColumn("semesters")}
          >
            Học kỳ
          </Checkbox>
        ),
      },
      {
        key: "start_date",
        label: (
          <Checkbox
            checked={visibleColumns.start_date}
            onChange={() => toggleColumn("start_date")}
          >
            Ngày bắt đầu
          </Checkbox>
        ),
      },
      {
        key: "end_date",
        label: (
          <Checkbox
            checked={visibleColumns.end_date}
            onChange={() => toggleColumn("end_date")}
          >
            Ngày kết thúc
          </Checkbox>
        ),
      },
      {
        key: "open_date",
        label: (
          <Checkbox
            checked={visibleColumns.open_date}
            onChange={() => toggleColumn("open_date")}
          >
            Ngày mở
          </Checkbox>
        ),
      },
      {
        key: "close_date",
        label: (
          <Checkbox
            checked={visibleColumns.close_date}
            onChange={() => toggleColumn("close_date")}
          >
            Ngày đóng
          </Checkbox>
        ),
      },
      {
        key: "is_deleted",
        label: (
          <Checkbox
            checked={visibleColumns.is_deleted}
            onChange={() => toggleColumn("is_deleted")}
          >
            Trạng thái
          </Checkbox>
        ),
      },
      {
        key: "created_at",
        label: (
          <Checkbox
            checked={visibleColumns.created_at}
            onChange={() => toggleColumn("created_at")}
          >
            Ngày tạo
          </Checkbox>
        ),
      },
      {
        key: "updated_at",
        label: (
          <Checkbox
            checked={visibleColumns.updated_at}
            onChange={() => toggleColumn("updated_at")}
          >
            Cập nhật gần nhất
          </Checkbox>
        ),
      },
    ],
  };

  const allColumns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    //   visible: visibleColumns.id,
    //   width: 80,
    // },
    {
      title: "STT",
      key: "stt",
      width: 70,
      align: "center",
      visible: visibleColumns.stt,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Năm học",
      dataIndex: "year",
      key: "year",
      visible: visibleColumns.year,
    },
    {
      title: "Học kỳ",
      dataIndex: "semesters",
      key: "semesters",
      visible: visibleColumns.semesters,
      render: (sem) => <Tag color='geekblue'>{sem}</Tag>,
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      visible: visibleColumns.start_date,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      visible: visibleColumns.end_date,
    },
    {
      title: "Ngày mở đăng ký",
      dataIndex: "open_date",
      key: "open_date",
      visible: visibleColumns.open_date,
    },
    {
      title: "Ngày đóng đăng ký",
      dataIndex: "close_date",
      key: "close_date",
      visible: visibleColumns.close_date,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_deleted",
      key: "is_deleted",
      visible: visibleColumns.is_deleted,
      render: (is_deleted) =>
        is_deleted === undefined ? (
          <Tag color='default'>N/A</Tag>
        ) : is_deleted === false ? (
          <Tag color='green'>Hoạt động</Tag>
        ) : (
          <Tag color='red'>Không hoạt động</Tag>
        ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.is_deleted === true ? (
          <Button
            type='link'
            icon={<BiRecycle />}
            onClick={() => handleDelete(record.id)}
            className='text-indigo-600'
          />
        ) : (
          <Space>
            <Button
              type='link'
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
              className='text-indigo-600'
            />
            <Popconfirm
              title='Bạn có chắc muốn xoá thông tin học kỳ này?'
              okText='OK'
              cancelText='Hủy'
              onConfirm={() => handleDelete(record.id)}
            >
              <Button type='link' danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Space>
        ),
      visible: true,
      fixed: "right",
      width: 150,
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className='h-full flex flex-col'>
      {contextHolder}
      <div className='bg-white rounded-xl shadow-sm p-6 flex flex-col h-full'>
        <div className='mb-6 flex-shrink-0'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center'>
              <CalendarOutlined className='text-indigo-600 text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Học kỳ</h1>
              <p className='text-sm text-gray-500'>
                Manage academic semester periods
              </p>
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between mb-6 gap-4 flex-shrink-0'>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={showAddModal}
            size='large'
            className='shadow-sm'
          >
            Thêm mới
          </Button>

          <Space size='middle'>
            <Input
              placeholder='Search semesters...'
              prefix={<SearchOutlined className='text-gray-400' />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size='large'
              allowClear
              className='rounded-lg'
            />

            <Select
              value={statusFilter}
              onChange={handleStatus}
              style={{ width: 180 }}
              size='large'
              options={[
                { value: "all", label: "Tất cả" },
                { value: "active", label: "Hoạt động" },
                { value: "inactive", label: "Không hoạt động" },
              ]}
            />

            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button
                icon={<SettingOutlined />}
                size='large'
                className='rounded-lg'
              >
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        <div className='flex-1 overflow-hidden'>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey='id'
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} semesters`,
            }}
          />
        </div>
      </div>

      <Modal
        title={editingRecord ? "Edit Semester" : "Add Semester"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Năm học'
            name='year'
            rules={[{ required: true, message: "Vui lòng nhập năm học!" }]}
          >
            <Input min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label='Học kỳ'
            name='semesters'
            rules={[{ required: true, message: "Vui lòng chọn học kỳ!" }]}
          >
            <Select placeholder='Chọn học kỳ'>
              <Select.Option value='Học kỳ 1'>Học kỳ 1</Select.Option>
              <Select.Option value='Học kỳ 2'>Học kỳ 2</Select.Option>
              <Select.Option value='Học kỳ 3'>Học kỳ 3</Select.Option>
            </Select>
          </Form.Item>

          {/* Ngày bắt đầu */}
          <Form.Item
            label='Ngày bắt đầu'
            name='start_date'
            rules={[{ required: true, message: "Vui lòng nhập ngày bắt đầu!" }]}
          >
            <DatePicker
              format='YYYY-MM-DD'
              style={{ width: "100%" }}
              onChange={(date) => {
                if (date) {
                  const openDate = date.subtract(3, "day");
                  const endDate = date.add(4, "month");
                  const closeDate = openDate.add(2, "day");

                  form.setFieldsValue({
                    open_date: openDate,
                    end_date: endDate,
                    close_date: closeDate,
                  });
                } else {
                  form.setFieldsValue({
                    open_date: null,
                    end_date: null,
                    close_date: null,
                  });
                }
              }}
            />
          </Form.Item>

          {/* Ngày kết thúc */}
          <Form.Item
            label='Ngày kết thúc'
            name='end_date'
            rules={[
              { required: true, message: "Vui lòng nhập ngày kết thúc!" },
            ]}
          >
            <DatePicker format='YYYY-MM-DD' style={{ width: "100%" }} />
          </Form.Item>

          {/* Ngày mở đăng ký */}
          <Form.Item
            label='Ngày mở đăng ký'
            name='open_date'
            rules={[
              { required: true, message: "Vui lòng nhập ngày mở đăng ký!" },
            ]}
          >
            <DatePicker
              format='YYYY-MM-DD'
              style={{ width: "100%" }}
              onChange={(date) => {
                if (date) {
                  form.setFieldsValue({ close_date: date.add(2, "day") });
                } else {
                  form.setFieldsValue({ close_date: null });
                }
              }}
            />
          </Form.Item>

          {/* Ngày đóng đăng ký (disabled) */}
          <Form.Item
            label='Ngày đóng đăng ký'
            name='close_date'
            rules={[
              { required: true, message: "Vui lòng nhập ngày đóng đăng ký!" },
            ]}
          >
            <DatePicker
              format='YYYY-MM-DD'
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

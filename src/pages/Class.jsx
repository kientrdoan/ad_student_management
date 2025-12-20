"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  message,
  Dropdown,
  Checkbox,
  Tag,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  UsergroupAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getAllMajorAction } from "../redux/actions/MajorAction";
import {
  addClassAction,
  deleteClassAction,
  editClassAction,
  getAllClassAction,
} from "../redux/actions/ClassAction";
import dayjs from "dayjs";
import { BiCycling, BiRecycle } from "react-icons/bi";

export default function Class() {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const majors = useSelector((state) => state.MajorReducer.majors);
  const classes = useSelector((state) => state.ClassReducer.classes);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [visibleColumns, setVisibleColumns] = useState({
    // id: true,
    stt: true,
    name: true,
    major: true,
    start_year: true,
    end_year: true,
    is_deleted: true,
    created_at: true,
    updated_at: true,
  });

  useEffect(() => {
    const loadData = async () => {
      await dispatch(getAllMajorAction(statusFilter));
      await dispatch(getAllClassAction(statusFilter));
    };
    loadData();
  }, [dispatch, statusFilter]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue({
      name: record.name,
      major: record.major.major_id,
      start_year: record.start_year,
      end_year: record.end_year,
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      let res;
      if (editingRecord) {
        res = await dispatch(
          editClassAction(editingRecord.id, { ...editingRecord, ...values })
        );
      } else {
        res = await dispatch(addClassAction(values));
      }
      if (res?.success) {
        messageApi.success(`${editingRecord ? "Sửa" : "Thêm"} thành công!`);
        dispatch(getAllClassAction(statusFilter));
        setIsModalVisible(false);
      } else {
        messageApi.error(res?.error?.response?.data?.message);
      }
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const filteredData = classes.filter((cls) => {
    const searchLower = searchText.toLowerCase();
    const major = majors.find((m) => String(m.id) === String(cls.major));
    return (
      cls.name?.toLowerCase().includes(searchLower) ||
      major?.name?.toLowerCase().includes(searchLower) ||
      cls.start_year?.toString().includes(searchLower) ||
      cls.end_year?.toString().includes(searchLower)
    );
  });

  const handleStatus = (value) => {
    // if (value === "all") {
    //   dispatch(getAllMajorAction({}));
    //   dispatch(getAllClassAction({}));
    // } else if (value === "active") {
    //   dispatch(getAllMajorAction(statusFilter));
    //   dispatch(getAllClassAction(statusFilter));
    // } else {
    //   dispatch(getAllMajorAction(statusFilter));
    //   dispatch(getAllClassAction(statusFilter));
    // }
    setStatusFilter(value);
  };

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteClassAction(id));
    if (res.success) {
      messageApi.success("Thành công!");
      dispatch(getAllClassAction(statusFilter));
    } else {
      messageApi.error("Thất bại!");
    }
  };

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
        key: "name",
        label: (
          <Checkbox
            checked={visibleColumns.name}
            onChange={() => toggleColumn("name")}
          >
            Tên lớp
          </Checkbox>
        ),
      },
      {
        key: "major",
        label: (
          <Checkbox
            checked={visibleColumns.major}
            onChange={() => toggleColumn("major")}
          >
            Ngành
          </Checkbox>
        ),
      },
      {
        key: "start_year",
        label: (
          <Checkbox
            checked={visibleColumns.start_year}
            onChange={() => toggleColumn("start_year")}
          >
            Năm bắt đầu
          </Checkbox>
        ),
      },
      {
        key: "end_year",
        label: (
          <Checkbox
            checked={visibleColumns.end_year}
            onChange={() => toggleColumn("end_year")}
          >
            Năm kết thúc
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
    //   width: 70,
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
      title: "Tên lớp",
      dataIndex: "name",
      key: "name",
      visible: visibleColumns.name,
      render: (name) => <Tag color='blue'>{name}</Tag>,
      width: 150,
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
      render: (major) => {
        // Kiểm tra nếu major là object có chứa tên
        if (major && major.major_name) {
          return major.major_name;
        }
        return "N/A";
      },
      visible: visibleColumns.major,
      width: 200,
    },
    {
      title: "Năm bắt đầu",
      dataIndex: "start_year",
      key: "start_year",
      visible: visibleColumns.start_year,
      width: 110,
    },
    {
      title: "Năm kết thúc",
      dataIndex: "end_year",
      key: "end_year",
      visible: visibleColumns.end_year,
      width: 110,
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
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.created_at,
      width: 150,
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
      width: 150,
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
              title='Bạn có chắc muốn xoá thông tin lớp sinh viên này?'
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
      width: 100,
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
              <UsergroupAddOutlined className='text-indigo-600 text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Lớp sinh viên
              </h1>
              <p className='text-sm text-gray-500'>
                Quản lý thông tin lớp sinh viên
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
              placeholder='Tìm kiếm...'
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
            rowKey={(r) => r.id}
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} classes`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>

      <Modal
        title={
          editingRecord
            ? "Cập nhật thông tin lớp sinh viên"
            : "Thêm thông tin lớp sinh viên"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Tên lớp'
            name='name'
            rules={[{ required: true, message: "Vui lòng nhập tên lớp!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='Ngành'
            name='major'
            rules={[{ required: true, message: "Vui lòng chọn ngành!" }]}
          >
            <Select placeholder='Vui lòng chọn ngành'>
              {majors?.map((m) => (
                <Select.Option key={m.id} value={m.id}>
                  {m.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label='Năm bắt đầu'
            name='start_year'
            rules={[{ required: true, message: "Vui lòng nhập nắm bắt đầu!" }]}
          >
            <Input type='number' />
          </Form.Item>

          <Form.Item
            label='Năm kết thúc'
            name='end_year'
            rules={[{ required: true, message: "Vui lòng nhập năm kết thúc!" }]}
          >
            <Input type='number' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

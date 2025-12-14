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
  Dropdown,
  Checkbox,
  Tag,
  Popconfirm,
  Select,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  EditOutlined,
  PlusOutlined,
  HomeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  addRoomAction,
  deleteRoomAction,
  editRoomAction,
  getAllRoomAction,
} from "../redux/actions/RoomAction";
import { BiRecycle } from "react-icons/bi";

export default function Room() {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.RoomReducer.rooms);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    room_code: true,
    building: true,
    max_capacity: true,
    is_active: true,
    created_at: true,
    updated_at: true,
  });

  useEffect(() => {
    dispatch(getAllRoomAction(statusFilter));
  }, [dispatch, statusFilter]);

  const showAddModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingRecord) {
        const newValues = { ...editingRecord, ...values };
        console.log("Edit room:", newValues);
        const res = await dispatch(editRoomAction(editingRecord.id, newValues));
        console.log("res edit", res);
        if (res.success) {
          messageApi.success("Edit room successfully!");
          dispatch(getAllRoomAction());
        } else {
          messageApi.error("Failed to edit room!");
        }
      } else {
        const res = await dispatch(addRoomAction(values));
        if (res.success) {
          messageApi.success("Thêm thành công!");
          dispatch(getAllRoomAction("active"));
        } else {
          messageApi.error(res?.error?.response?.data?.message);
        }
      }
      setIsModalVisible(false);
    } catch (err) {
      console.log("Validate Failed:", err);
    }
  };

  const filteredData = rooms.filter((room) => {
    const searchLower = searchText.toLowerCase();
    return (
      room.room_code?.toLowerCase().includes(searchLower) ||
      room.building?.toLowerCase().includes(searchLower) ||
      room.max_capacity?.toString().includes(searchLower)
    );
  });

  const handleStatus = (value) => {
    // const payload = {
    //   is_deleted: value === "active" ? 1 : 0,
    // };
    // if (value === "all") {
    //   dispatch(getAllRoomAction({}));
    // } else if (value === "active") {
    //   dispatch(getAllRoomAction(payload));
    // } else {
    //   dispatch(getAllRoomAction(payload));
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
    const res = await dispatch(deleteRoomAction(id));
    if (res.success) {
      messageApi.success("Thành công!");
      dispatch(getAllRoomAction(statusFilter));
    } else {
      messageApi.error("Thất bại!");
    }
  };

  const columnMenu = {
    items: [
      {
        key: "id",
        label: (
          <Checkbox
            checked={visibleColumns.id}
            onChange={() => toggleColumn("id")}
          >
            ID
          </Checkbox>
        ),
      },
      {
        key: "room_code",
        label: (
          <Checkbox
            checked={visibleColumns.room_code}
            onChange={() => toggleColumn("room_code")}
          >
            Room Code
          </Checkbox>
        ),
      },
      {
        key: "building",
        label: (
          <Checkbox
            checked={visibleColumns.building}
            onChange={() => toggleColumn("building")}
          >
            Building
          </Checkbox>
        ),
      },
      {
        key: "max_capacity",
        label: (
          <Checkbox
            checked={visibleColumns.max_capacity}
            onChange={() => toggleColumn("max_capacity")}
          >
            Max Capacity
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
            Created At
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
            Updated At
          </Checkbox>
        ),
      },
    ],
  };

  const allColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      visible: visibleColumns.id,
      width: 80,
    },
    {
      title: "Mã phòng",
      dataIndex: "room_code",
      key: "room_code",
      visible: visibleColumns.room_code,
      render: (code) => <Tag color='orange'>{code}</Tag>,
    },
    {
      title: "Toà nhà",
      dataIndex: "building",
      key: "building",
      visible: visibleColumns.building,
    },
    {
      title: "Số lượng tối đa",
      dataIndex: "max_capacity",
      key: "max_capacity",
      visible: visibleColumns.max_capacity,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_deleted",
      visible: visibleColumns.is_active,
      render: (is_active) =>
        is_active === undefined ? (
          <Tag color='default'>N/A</Tag>
        ) : is_active ? (
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
    },
    {
      title: "Cập nhật gần nhất",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => (text ? dayjs(text).format("DD/MM/YYYY HH:mm") : "N/A"),
      visible: visibleColumns.updated_at,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.is_active === false ? (
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
              title='Bạn có chắc muốn xoá thông tin khoa này?'
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
              <HomeOutlined className='text-indigo-600 text-lg' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Phòng học</h1>
              <p className='text-sm text-gray-500'>
                Manage classroom and facility information
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
              placeholder='Search rooms...'
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
              showTotal: (total) => `Total ${total} rooms`,
            }}
            // scroll={{ x: "max-content", y: "calc(100vh - 400px)" }}
          />
        </div>
      </div>

      <Modal
        title={
          editingRecord ? "Cập nhật thông tin phòng học" : "Thêm mới phòng học"
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText='Save'
      >
        <Form form={form} layout='vertical'>
          <Form.Item
            label='Mã phòng'
            name='room_code'
            rules={[{ required: true, message: "Vui lòng nhập mã phòng!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Toà nhà'
            name='building'
            rules={[{ required: true, message: "Vui lòng nhập toà nhà!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Số lượng tối đa'
            name='max_capacity'
            rules={[
              { required: true, message: "Vui lòng nhập số lượng tối đa!" },
            ]}
          >
            <Input type='number' min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

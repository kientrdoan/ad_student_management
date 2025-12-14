/* eslint-disable no-unused-vars */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Table, Card, Spin, Empty, Button, Modal, DatePicker, message } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BiSolidEdit } from "react-icons/bi";
import { getAllTimeSlotAction, updateDateTimeSlotAction } from "../redux/actions/TimeSlotAction";

dayjs.locale("vi");

export default function TimeSlot() {
  const { id: course_id } = useParams();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage()

  // ===== STATE =====
  const [open, setOpen] = useState(false);
  const [selectedBuoiHoc, setSelectedBuoiHoc] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  // ===== REDUX STATE =====
  const time_slots = useSelector(
    (state) => state.TimeSlotReducer.time_slots
  );

  // ===== FETCH DATA =====
  useEffect(() => {
    dispatch(getAllTimeSlotAction(course_id));
  }, [course_id, dispatch]);

  const dataSource = useMemo(() => {
    console.log("1", time_slots)
    if (!Array.isArray(time_slots)) return [];
    return time_slots.map((bh) => ({
      key: bh.id,
      id: bh.id,
      date: bh.date,
      dayOfWeek: dayjs(bh.date).format("dddd"),
    }));
  }, [time_slots]);


  const handleEdit = (record) => {
    setSelectedBuoiHoc(record);
    setSelectedDate(dayjs(record.date));
    setOpen(true);
  };

  const handleOk = async () => {
    if (!selectedBuoiHoc || !selectedDate) return;

    const payload = {
      time_slot_id: selectedBuoiHoc.id,
      date: selectedDate.format("YYYY-MM-DD"),
    };

    console.log("UPDATE BUỔI HỌC:", payload);

    const result = await dispatch(updateDateTimeSlotAction(course_id, payload));

    if(result.success){
      messageApi.success("Cập nhật ngày học thành công")
      dispatch(getAllTimeSlotAction(course_id))
    }else{
      messageApi.error("Cập nhật ngày học thất bại")
    }

    setOpen(false);
  };

  // ===== TABLE COLUMNS =====
  const columns = [
    {
      title: "Ngày học",
      dataIndex: "date",
      key: "date",
      render: (text) => (
        <b>{dayjs(text).format("DD/MM/YYYY")}</b>
      ),
    },
    {
      title: "Thứ",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<BiSolidEdit />}
          className="text-indigo-600"
          onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  // ===== RENDER =====
  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {contextHolder}
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
        📋 Lịch sử buổi học
      </h1>

      <Card>
        <Spin spinning={!time_slots}>
          {dataSource.length > 0 ? (
            <Table
              rowKey="id"
              columns={columns}
              dataSource={dataSource}
              pagination={{
                pageSize: 15,
                showTotal: (total) => `Tổng ${total} buổi học`,
              }}
            />
          ) : (
            <Empty
              description="Không có dữ liệu buổi học"
              style={{ margin: "48px 0" }}
            />
          )}
        </Spin>
      </Card>

      {/* ===== MODAL EDIT ===== */}
      <Modal
        title="Chỉnh sửa ngày học"
        open={open}
        onOk={handleOk}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <DatePicker
          style={{ width: "100%" }}
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          format="DD/MM/YYYY"
        />
      </Modal>
    </div>
  );
}
